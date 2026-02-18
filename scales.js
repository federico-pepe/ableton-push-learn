/* 
 * This file is needed to visualize different scales
 *
 * To add a new scale:
 * 1. Add an object to the array
 * 2. Set the name
 * 3. Add the notes that form the scale (in semitones) from the root note
 * 
*/
let scales = [
  {
    name: 'Major',
    notes: [2, 4, 5, 7, 9, 11]
  },
  {
    name: 'Minor',
    notes: [2, 3, 5, 7, 8, 10]
  },
  {
    name: 'Dorian',
    notes: [2, 3, 5, 7, 9, 10]
  },
  {
    name: 'Mixolydian',
    notes: [2, 4, 5, 7, 9, 10]
  },
  {
    name: 'Lydian',
    notes: [2, 4, 6, 7, 9, 11]
  },
  {
    name: 'Phrygian',
    notes: [1, 3, 5, 7, 8, 10]
  },
  {
    name: 'Locrian',
    notes: [1, 3, 5, 6, 8, 10]
  },
  {
    name: 'Whole Tone',
    notes: [2, 4, 6, 8, 10]
  },
  {
    name: 'Half-whole Dim.',
    notes: [1, 3, 4, 6, 7, 9, 10]
  },
  {
    name: 'Whole-half Dim.',
    notes: [2, 3, 5, 6, 8, 9, 11]
  },
  {
    name: 'Minor Blues',
    notes: [3, 5, 6, 7, 10]
  },
  {
    name: 'Minor Pentatonic',
    notes: [3, 5, 7, 10]
  },
  {
    name: 'Major Pentatonic',
    notes: [2, 4, 7, 9]
  },
  {
    name: 'Harmonic Minor',
    notes: [2, 3, 5, 7, 8, 11]
  },
  {
    name: 'Harmonic Major',
    notes: [2, 4, 5, 7, 8, 11]
  }, 
  {
    name: 'Dorian #4',
    notes: [2, 3, 6, 7, 9, 10]
  },
  {
    name: 'Phrygian Dominant',
    notes: [1, 4, 5, 7, 8, 10]
  },
  {
    name: 'Melodic Minor',
    notes: [2, 3, 5, 7, 9, 11]
  },
  {
    name: 'Lydian Augmented',
    notes: [2, 4, 5, 6, 8, 9, 11]
  },
  {
    name: 'Lydian Dominant',
    notes: [2, 4, 6, 7, 9, 10]
  },
  {
    name: 'Super Locrian',
    notes: [1, 3, 4, 6, 8, 10]
  },
  {
    name: '8-Tone Spanish',
    notes: [1, 3, 4, 5, 6, 8, 10]
  },
  {
    name: 'Bhairav',
    notes: [1, 4, 5, 7, 8, 11]
  },
  {
    name: 'Hungarian Minor',
    notes: [2, 3, 6, 7, 8, 11]
  }, 
  {
    name: 'Hirasoji',
    notes: [2, 3, 7, 8]
  },
  {
    name: 'In-Sen',
    notes: [1, 5, 7, 10]
  },
  {
    name: 'Iwato',
    notes: [1, 5, 6, 10]
  },
  {
    name: 'Kumoi',
    notes: [2, 3, 7, 9]
  },
  {
    name: 'Pelog Selisir',
    notes: [1, 3, 7, 8]
  },
  {
    name: 'Pelog Tembung',
    notes: [1, 5, 7, 8]
  },
  {
    name: 'Messiaen 3',
    notes: [2, 3, 4, 6, 7, 8, 10, 11]
  },
  {
    name: 'Messiaen 4',
    notes: [1, 2, 5, 6, 7, 8, 10]
  },
  {
    name: 'Messiaen 5',
    notes: [1, 5, 6, 7, 11]
  },
  {
    name: 'Messiaen 6',
    notes: [2, 4, 5, 6, 8, 10, 11]
  },
  {
    name: 'Messiaen 7',
    notes: [1, 2, 3, 5, 6, 7, 8, 9, 11]
  }
]