let canvas;

// Note related
let noteArray = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
let notes = [];

// Initial setup
let root = 'C';
let octave;
let midiShift = 2; // Need this shift to have the note range between C-2 and G8 (C3 = MIDI 60)

// UI Related
let selectRoot;
let selectScale;
let checkbox;
let fixed = true;
let checkName;
let showNames = true;
let showFlats = false;

function setup() {
  canvas = createCanvas(480, 480);
  canvas.parent('canvas-container');
  // UI
  /// ROOT
  selectRoot = select('#root').changed(setRoot);
  /// SCALE
  selectScale = select('#scaleSel').changed(setScale);
  /// OCTAVES
  select("#plus").mousePressed(setOctUp);
  select("#minus").mousePressed(setOctDown);
  /// FIXED SCALE
  checkbox = select("#fixed").changed(setFixed);
  checkNames = select("#showName").changed(setDisplayNotes);
  checkFlats = select("#showFlats").changed(setFlats);
  
  // Create notes
  createNotes();
  
  // Draw the grid;
  let defaultNote = 36; // C1 as on Push
  octave = notes[defaultNote].octave;
  setScale();
  drawNotes(defaultNote);
  
  noLoop();
}

function draw() {
  
}

function drawNotes(note) {
  
  background(255);
  
  let columns = 8;
  let rows = 8;

  let gridW = canvas.width / columns;
  let gridH = canvas.height / rows;
  
  stroke(0);
  
  let n; // Starting MIDI note
  
  if(fixed) {
    n = 12 * (octave + midiShift);
  } else {
    n = note;
    // Fixing an issue with displaying the grid of pads on lower octaves
    if(n < 0) {
      n = n + 12;
    }
  }
  
  let x = 0;
  let y = height - gridH
  // Can't use a nested loop so I need to draw the full grid from the bottom left pad
  for(let i = 0; i < columns*rows; i++) {  
    if(i > 0 && i % columns == 0) {
      x = 0;
      y = y - gridH;
      n = n - 3; // This is needed to go up in 4ths (default layout on Push)
    } else {
      x = i % columns * gridW;
    }
    // Avoid undefined error
    if(notes[n]) {
      // Let's color the grid.
      if(notes[n].note === root) {
        fill(255, 0, 0, 100);
      } else if(scala.indexOf(notes[n].note) >= 0 ) {
        fill(255);
      } else {
        fill(127);
      }
      // Draw the grid
      rect(x, y, gridW, gridH);

      // Write the notes' names
      if(showNames) {
        textAlign(CENTER, CENTER)
        fill(0);
        let o = notes[n].note;
        if(showFlats) {
          let flats  = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'];
          o = flats[noteArray.indexOf(o)];
        }
        text(o+notes[n].octave, x + gridW/2, y + gridH/2);
      }
    }
    n++;
  }
  
}

let scala = [];

function setScale() {
  // Clean the array
  scala = [];
  // Find the root note
  let f = noteArray.indexOf(root);
  // Find the MIDI number
  let m = notes[f+((octave+1)*12)];
  // console.log("MIDI: "+ JSON.stringify(m));
  // Get the notes from Scale.js
  for(let j = 0; j < scales[selectScale.value()].notes.length; j++) {
   let n = f + scales[selectScale.value()].notes[j];
   if(n > 11) {
     n = n % 12;
   }
   scala.push(noteArray[n]);
  }
  drawNotes(f);
}

function setDisplayNotes() {
  if(checkNames.checked()) {
    showNames = true;
    document.getElementById("showFlats").disabled = false;
  } else {
    showNames = false;
    document.getElementById("showFlats").disabled = true;
  }
  console.log(select("#showFlats").disabled);
  drawNotes(noteArray.indexOf(root) + (octave*12))
}

function setFlats() {
  if(checkFlats.checked()) {
    showFlats = true;
  } else {
    showFlats = false;
  }
  drawNotes(noteArray.indexOf(root) + (octave*12))
}

function setFixed() {
  if(checkbox.checked()) {
    fixed = true;
  } else {
    fixed = false;
  }
  drawNotes(noteArray.indexOf(root) + (octave + midiShift)*12)
}

function setRoot() {
  root = selectRoot.value();
  setScale();
  drawNotes(noteArray.indexOf(root) + (octave + midiShift)*12);
}

function setOctDown() {
  octave--;
  if(octave < -2) {
    octave++;
  }
  
  drawNotes(noteArray.indexOf(root) + (octave*12));
}

function setOctUp() {
  octave++;
  if(octave > 8) {
    octave--;
  }
  drawNotes(noteArray.indexOf(root) + (octave*12));
}

function Note(midi, note, octave) {
  this.midi = midi;
  this.note = note;
  this.octave = octave - midiShift;
}

function createNotes() {
  // Fill the Root Note selector in the UI
  for(let i = 0; i < noteArray.length; i++) {
    selectRoot.option(noteArray[i]);
  }
  // Fill the Scale Selector in the UI
  for(let i = 0; i < scales.length; i++) {
    selectScale.option(scales[i].name, i);
  }
  // Fill the Note Array with note objects
  for(let i = 0; i <= 127; i++) {
    let newNote = new Note(i, noteArray[i%12], floor(i/12));
    notes.push(newNote);
  }
  console.log(notes);
}