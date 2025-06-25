import { useState, useCallback, useEffect } from 'react';
import '../styles/Keyboard.css';

// Generate 88-key piano (A0 to C8, MIDI notes 21-108)
const generatePianoKeys = () => {
  const noteNames = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
  const whiteKeyPattern = [0, 2, 4, 5, 7, 9, 11]; // C, D, E, F, G, A, B
  const blackKeyPattern = [1, 3, 6, 8, 10]; // C#, D#, F#, G#, A#
  
  const whiteKeys = [];
  const blackKeys = [];
  
  // Start from A0 (MIDI note 21) to C8 (MIDI note 108)
  for (let midiNote = 21; midiNote <= 108; midiNote++) {
    const noteIndex = midiNote % 12;
    const octave = Math.floor(midiNote / 12) - 1;
    const noteName = noteNames[noteIndex];
    
    if (whiteKeyPattern.includes(noteIndex)) {
      whiteKeys.push({
        note: midiNote,
        name: `${noteName}${octave}`,
        keyCode: null // Remove keyboard mapping for simplicity with 88 keys
      });
    } else if (blackKeyPattern.includes(noteIndex)) {
      blackKeys.push({
        note: midiNote,
        name: `${noteName}${octave}`,
        keyCode: null,
        position: getBlackKeyPosition(midiNote)
      });
    }
  }
  
  return { whiteKeys, blackKeys };
};

const getBlackKeyPosition = (midiNote) => {
  // Simply count how many white keys come before this black key
  let whiteKeyCount = 0;
  
  for (let i = 21; i < midiNote; i++) {
    if ([0, 2, 4, 5, 7, 9, 11].includes(i % 12)) { // White keys: C, D, E, F, G, A, B
      whiteKeyCount++;
    }
  }
  
  // Black key should be positioned between white keys
  // A#0 should be between A0 and B0, so slightly left of center
  return whiteKeyCount - 0.3;
};

const { whiteKeys: WHITE_KEYS, blackKeys: BLACK_KEYS } = generatePianoKeys();

function Keyboard({ onNotePlay, onNoteStop, playedNotes = [] }) {
  const [pressedKeys, setPressedKeys] = useState(new Set());
  
  // Create a Set of MIDI notes that have been played for quick lookup
  const playedMidiNotes = new Set(playedNotes.map(noteData => noteData.midi));

  const handleKeyDown = useCallback((note) => {
    if (pressedKeys.has(note)) return;
    
    setPressedKeys(prev => new Set([...prev, note]));
    onNotePlay?.(note, 127);
  }, [pressedKeys, onNotePlay]);

  const handleKeyUp = useCallback((note) => {
    setPressedKeys(prev => {
      const newSet = new Set(prev);
      newSet.delete(note);
      return newSet;
    });
    onNoteStop?.(note);
  }, [onNoteStop]);

  const handleMouseDown = useCallback((note) => {
    handleKeyDown(note);
  }, [handleKeyDown]);

  const handleMouseUp = useCallback((note) => {
    handleKeyUp(note);
  }, [handleKeyUp]);

  // Removed keyboard event handling for 88-key piano (too many keys to map)

  return (
    <div className="keyboard-container">
      <div className="keyboard">
        {WHITE_KEYS.map((key) => (
          <button
            key={key.note}
            className={`white-key ${pressedKeys.has(key.note) ? 'pressed' : ''} ${playedMidiNotes.has(key.note) ? 'highlighted' : ''}`}
            onMouseDown={() => handleMouseDown(key.note)}
            onMouseUp={() => handleMouseUp(key.note)}
            onMouseLeave={() => handleMouseUp(key.note)}
          >
            <span className="key-label">{key.name}</span>
          </button>
        ))}
        
        <div className="black-keys">
          {BLACK_KEYS.map((key) => (
            <button
              key={key.note}
              className={`black-key ${pressedKeys.has(key.note) ? 'pressed' : ''} ${playedMidiNotes.has(key.note) ? 'highlighted' : ''}`}
              style={{ left: `${key.position * 27.6}px` }}
              onMouseDown={() => handleMouseDown(key.note)}
              onMouseUp={() => handleMouseUp(key.note)}
              onMouseLeave={() => handleMouseUp(key.note)}
            >
              <span className="key-label">{key.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Keyboard;