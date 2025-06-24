import { useState, useCallback, useEffect } from 'react';
import '../styles/Keyboard.css';

const WHITE_KEYS = [
  { note: 60, name: 'C', keyCode: 'KeyA' },
  { note: 62, name: 'D', keyCode: 'KeyS' },
  { note: 64, name: 'E', keyCode: 'KeyD' },
  { note: 65, name: 'F', keyCode: 'KeyF' },
  { note: 67, name: 'G', keyCode: 'KeyG' },
  { note: 69, name: 'A', keyCode: 'KeyH' },
  { note: 71, name: 'B', keyCode: 'KeyJ' },
];

const BLACK_KEYS = [
  { note: 61, name: 'C#', keyCode: 'KeyW', position: 1 },
  { note: 63, name: 'D#', keyCode: 'KeyE', position: 2 },
  { note: 66, name: 'F#', keyCode: 'KeyT', position: 4 },
  { note: 68, name: 'G#', keyCode: 'KeyY', position: 5 },
  { note: 70, name: 'A#', keyCode: 'KeyU', position: 6 },
];

function Keyboard({ onNotePlay, onNoteStop }) {
  const [pressedKeys, setPressedKeys] = useState(new Set());

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

  useEffect(() => {
    const keyMap = new Map();
    [...WHITE_KEYS, ...BLACK_KEYS].forEach(key => {
      keyMap.set(key.keyCode, key.note);
    });

    const handleKeyboardDown = (event) => {
      const note = keyMap.get(event.code);
      if (note && !event.repeat) {
        event.preventDefault();
        handleKeyDown(note);
      }
    };

    const handleKeyboardUp = (event) => {
      const note = keyMap.get(event.code);
      if (note) {
        event.preventDefault();
        handleKeyUp(note);
      }
    };

    window.addEventListener('keydown', handleKeyboardDown);
    window.addEventListener('keyup', handleKeyboardUp);

    return () => {
      window.removeEventListener('keydown', handleKeyboardDown);
      window.removeEventListener('keyup', handleKeyboardUp);
    };
  }, [handleKeyDown, handleKeyUp]);

  return (
    <div className="keyboard-container">
      <div className="keyboard">
        {WHITE_KEYS.map((key) => (
          <button
            key={key.note}
            className={`white-key ${pressedKeys.has(key.note) ? 'pressed' : ''}`}
            onMouseDown={() => handleMouseDown(key.note)}
            onMouseUp={() => handleMouseUp(key.note)}
            onMouseLeave={() => handleMouseUp(key.note)}
          >
            <span className="key-label">{key.name}</span>
            <span className="key-hint">{key.keyCode.replace('Key', '')}</span>
          </button>
        ))}
        
        <div className="black-keys">
          {BLACK_KEYS.map((key) => (
            <button
              key={key.note}
              className={`black-key ${pressedKeys.has(key.note) ? 'pressed' : ''}`}
              style={{ left: `${(key.position - 1) * 60 + 42}px` }}
              onMouseDown={() => handleMouseDown(key.note)}
              onMouseUp={() => handleMouseUp(key.note)}
              onMouseLeave={() => handleMouseUp(key.note)}
            >
              <span className="key-label">{key.name}</span>
              <span className="key-hint">{key.keyCode.replace('Key', '')}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Keyboard;