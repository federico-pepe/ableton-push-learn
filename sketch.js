/*
 * Canvas Selectors
 */
let canvas,
    canvasElement = document.querySelector('canvas');

/*
 * Note related
 */
let noteArray = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'],
    notes = [],
    scala = [];


/*
 * Initial setup for note display
 */
let root = 'C',
    octave,
    midiShift = 2, // This shift ensures the note range is between C-2 and G8 (e.g., C3 = MIDI 60)
    refNote,               // Reference note used to update and redraw the grid
    midiNotes = [];  // Array to store currently active MIDI note numbers


/*
 * UI elements and state flags
 */
let selectRoot,               // Dropdown for root note selection
    selectScale,              // Dropdown for scale selection
    checkbox,                 // Checkbox element for fixed scale mode
    fixed = true,     // Flag indicating whether the scale is fixed
    checkNames,               // Checkbox element for toggling display of note names
    showNames = true, // Flag for showing note names on pads
    showFlats = false;// Flag for displaying flats instead of sharps


/*
 * Layout mode variables for switching between "Push" and "Move"
 */
let layoutMode = "Push", // Default layout mode
    selectLayout;               // Dropdown for layout mode selection

const HOVER_SCALE = 1.05;
let isExpanded = false,
    isHovered = false;

/*
 * This stuff all pertains to the sizing of the canvas
 */
const screenSize = () => ({
        //These are more robust measurements that will work in a larger variety of browsers
        width: window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth,
        height: window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight
    }),
    desiredCanvasSize = function () {
        let screen = screenSize(),
            canvasMargin = 20
            size = 500; //This is our default

        // Create the canvas based on window width (use square canvas for small screens)
        if (screen.width < size)
            size = screen.width - canvasMargin;

        //Making the canvas a little bigger on high resolution screens
        else if (screen.width > screen.height && screen.height > 1000)
            size = screen.height * 0.6;


        return size;
    };

/*
 * Default PS5 Functions
 */
function setup() {
    let desiredSize = desiredCanvasSize();

    canvas = createCanvas(desiredSize, desiredSize, P2D, canvasElement);

    //Init the canvas
    canvas.parent('canvas-container');

    // Initialize UI elements and their event handlers
    selectLayout = select('#layoutMode').changed(setLayoutMode);
    selectRoot = select('#root').changed(setRoot);
    selectScale = select('#scaleSel').changed(setScale);
    select("#plus").mousePressed(setOctUp);
    select("#minus").mousePressed(setOctDown);
    checkbox = select("#fixed").changed(setFixed);
    checkNames = select("#showName").changed(setDisplayNotes);
    checkFlats = select("#showFlats").changed(setFlats);

    window.addEventListener("resize", windowResized);

    // Create the array of note objects and populate the UI selectors
    createNotes();

    // Set initial grid parameters
    refNote = 36; // Starting at MIDI note 36 (C1 as on Push)
    octave = notes[refNote].octave;
    setScale();
}

function draw() {
    // Redraw the grid on each frame
    drawNotes(refNote);
}


/*
 * Adjusts canvas sizes
 */
function resizeVisualizer(size) {
    if (layoutMode === "Push")
        resizeCanvas(size, size);
    else
        resizeCanvas(size, size / 2);
}

//Adjusts size on window resize
let resizeTimeout;
function windowResized() {
    // This timeout method is used to prevent the canvas from resizing multiple times during a single window resize event.
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(function () {
        if (isExpanded)
            resizeVisualizer(Math.min(window.innerWidth * 0.9, window.innerHeight * 0.9))
        else
            resizeVisualizer(desiredCanvasSize());
    }, 500);
}

//Makes canvas pop in and out when hovered
canvasElement.addEventListener('mouseenter', () => {
    isHovered = true;
    if (!isExpanded)
        resizeVisualizer(desiredCanvasSize() * HOVER_SCALE);
});
canvasElement.addEventListener('mouseleave', () => {
    isHovered = false;
    if (!isExpanded)
        resizeVisualizer(desiredCanvasSize());
});

//The backdrop that appears when the canvas is maximized
document.getElementById('canvasBackdrop').addEventListener('click', (e) => {
    isExpanded = false;
    e.target.style.display = 'none';
    canvasElement.classList.remove('expanded');

    resizeVisualizer(desiredCanvasSize())
});

//Maximize our canvas when it's clicked
canvasElement.addEventListener('click', () => {
    isExpanded = !isExpanded;
    let backdrop = document.getElementById('canvasBackdrop');

    if (isExpanded) {
        backdrop.style.display = 'block';
        canvasElement.classList.add('expanded');
        resizeVisualizer(Math.min(window.innerWidth * 0.9, window.innerHeight * 0.9))
    } else {
        backdrop.style.display = 'none';
        canvasElement.classList.remove('expanded');
        resizeVisualizer(desiredCanvasSize())
    }
});



/*
 * Utility functions
 */

// Draw the grid of pads with appropriate note values and colors
function drawNotes(note) {
    background(255);
    let columns = 8;
    let rows, gridH, gridW;
    gridW = canvas.width / columns;

    // Determine grid dimensions based on layout mode
    if (layoutMode === "Push") {
        rows = 8;
        gridH = canvas.height / 8;
    } else { // Move mode: 4 rows; cell height remains same as in Push mode
        rows = 4;
        gridH = canvas.width / 8;
    }

    stroke(0);

    let n; // Variable to hold the starting MIDI note for drawing

    if (layoutMode === "Push") {
        if (fixed) {
            n = 12 * (octave + midiShift);
        } else {
            n = note;
            if (n < 0) {
                n = n + 12;
            }
        }
    } else { // Move mode ignores fixed mode entirely
        // Always use non-fixed behavior for Move mode.
        n = note - 3;
        if (n < 0) {
            n = n + 12;
        }
    }

    // Draw the grid
    if (layoutMode === "Push") {
        // Draw Push grid (8x8)
        let x = 0;
        let y = height - gridH;
        for (let i = 0; i < columns * rows; i++) {
            if (i > 0 && i % columns == 0) {
                x = 0;
                y = y - gridH;
                // In Push mode, the note progression on each new row decreases by 3 semitones.
                n = n - 3;
            } else {
                x = (i % columns) * gridW;
            }
            if (notes[n]) {
                if (notes[n].note === root) {
                    fill(250, 179, 174);
                } else if (scala.indexOf(notes[n].note) >= 0) {
                    fill(255);
                } else {
                    fill(167, 173, 178);
                }
                if (midiNotes.includes(notes[n].midi)) {
                    fill(0, 255, 0);
                }
                rect(x, y, gridW, gridH);
                if (showNames) {
                    textAlign(CENTER, CENTER);
                    fill(0);
                    let o = notes[n].note;
                    if (showFlats) {
                        let flats = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'];
                        o = flats[noteArray.indexOf(o)];
                    }
                    text(o + notes[n].octave, x + gridW / 2, y + gridH / 2);
                }
            }
            n++;
        }
    } else { // Move mode
        // For Move mode, we want to draw 4 rows using an offset so that the bottom row's fourth cell is the root.
        // Compute the starting note for the bottom row (non-fixed branch is used).
        let bottomRowStart = n;
        // Draw rows from bottom (r = 0) to top (r = 3)
        for (let r = 0; r < rows; r++) {
            // Each row is offset upward by 5 semitones relative to the row below.
            let rowStart = bottomRowStart + r * 5;
            for (let c = 0; c < columns; c++) {
                let currentNote = rowStart + c;
                let x = c * gridW;
                let y = height - gridH - r * gridH; // Bottom row (r=0) is at y = height - gridH
                if (notes[currentNote]) {
                    if (notes[currentNote].note === root) {
                        fill(250, 179, 174);
                    } else if (scala.indexOf(notes[currentNote].note) >= 0) {
                        fill(255);
                    } else {
                        fill(167, 173, 178);
                    }
                    if (midiNotes.includes(notes[currentNote].midi)) {
                        fill(0, 255, 0);
                    }
                    rect(x, y, gridW, gridH);
                    if (showNames) {
                        textAlign(CENTER, CENTER);
                        fill(0);
                        let o = notes[currentNote].note;
                        if (showFlats) {
                            let flats = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'];
                            o = flats[noteArray.indexOf(o)];
                        }
                        text(o + notes[currentNote].octave, x + gridW / 2, y + gridH / 2);
                    }
                }
            }
        }
    }
}
function setScale() {
    scala = [];
    let f = noteArray.indexOf(root);
    for (let j = 0; j < scales[selectScale.value()].notes.length; j++) {
        let n = f + scales[selectScale.value()].notes[j];
        if (n > 11) {
            n = n % 12;
        }
        scala.push(noteArray[n]);
    }
    // Recalculate refNote to include octave and midiShift
    refNote = noteArray.indexOf(root) + (octave + midiShift) * 12;
}

function setDisplayNotes() {
    if (checkNames.checked()) {
        showNames = true;
        document.getElementById("showFlats").disabled = false;
    } else {
        showNames = false;
        document.getElementById("showFlats").disabled = true;
    }
    console.log(select("#showFlats").disabled);
    refNote = noteArray.indexOf(root) + (octave * 12);
}

function setFlats() {
    if (checkFlats.checked()) {
        showFlats = true;
    } else {
        showFlats = false;
    }
    refNote = noteArray.indexOf(root) + (octave * 12);
}

function setFixed() {
    if (checkbox.checked()) {
        fixed = true;
    } else {
        fixed = false;
    }
    refNote = noteArray.indexOf(root) + (octave + midiShift) * 12;
}

function setRoot() {
    root = selectRoot.value();
    setScale();
    refNote = noteArray.indexOf(root) + (octave + midiShift) * 12;
}

function setOctDown() {
    octave--;
    if (octave < -2) {
        octave++;
    }
    refNote = noteArray.indexOf(root) + (octave * 12);
}

function setOctUp() {
    octave++;
    if (octave > 8) {
        octave--;
    }
    refNote = noteArray.indexOf(root) + (octave * 12);
}

function setLayoutMode() {
    layoutMode = selectLayout.value();
    let w = canvas.width;

    if (layoutMode === "Push") {
        resizeCanvas(w, w);

        // Re-enable fixed mode in Push mode
        document.getElementById("fixed").disabled = false;

        // Set our note and octave back to the Push's default values.
        refNote = 36;
        octave = notes[refNote].octave;
    } else {
        // In Move mode, set canvas height to 4 rows and force non-fixed mode.
        // also set the refNote to C3 instead of C1
        refNote = 60;
        octave = notes[refNote].octave + midiShift;
        resizeCanvas(w, w / 2);
        let fixedCheckbox = document.getElementById("fixed");
        fixedCheckbox.checked = false;
        fixed = false;
        fixedCheckbox.disabled = true;
    }
}

function Note(midi, note, octave) {
    this.midi = midi;
    this.note = note;
    this.octave = octave - midiShift;
}

function createNotes() {
    for (let i = 0; i < noteArray.length; i++) {
        selectRoot.option(noteArray[i]);
    }
    for (let i = 0; i < scales.length; i++) {
        selectScale.option(scales[i].name, i);
    }
    for (let i = 0; i <= 127; i++) {
        let newNote = new Note(i, noteArray[i % 12], floor(i / 12));
        notes.push(newNote);
    }
    console.log(notes);
}


// --- WebMidi Integration ---

// Enable WEBMIDI.js and trigger the midiEnabled() function when ready
WebMidi.enable()
    .then(midiEnabled)
    .catch(err => {
        // Log the error instead of alerting
        console.warn("MIDI could not be enabled:", err);
    });

let selectedDevice;

function midiEnabled() {
    let dropdown = document.getElementById("midiDevice");
    if (WebMidi.inputs.length < 1) {
        console.log("No MIDI Input");
    } else {
        WebMidi.inputs.forEach((device, index) => {
            var option = document.createElement("option");
            option.value = index;
            option.text = device.name;
            dropdown.add(option);
        });
    }
    selectedDevice = WebMidi.inputs[0];
    listenToMidi();
    dropdown.addEventListener("change", function () {
        selectedDevice.removeListener();
        selectedDevice = WebMidi.inputs[this.value];
        listenToMidi();
    });
}

function listenToMidi() {
    selectedDevice.addListener("noteon", e => {
        midiNotes.push(e.note.number);
    });
    selectedDevice.addListener("noteoff", e => {
        var index = midiNotes.indexOf(e.note.number);
        if (index > -1) {
            midiNotes.splice(index, 1);
        }
    });
}

