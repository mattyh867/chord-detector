import '../styles/MidiInput.css';
import { useMidiAccess } from '../hooks/useMidiAccess';
import { useMidiTracking } from '../hooks/useMidiRecording';
import { Chord } from "@tonaljs/tonal";

function MidiInput({ onMidiNote, playedNotes, resetNotes }) {
  const { midiSupported, midiInputs, attachMidiHandler, detachMidiHandler } = useMidiAccess();
  
  // Set up MIDI tracking without internal state
  useMidiTracking(
    onMidiNote,
    attachMidiHandler,
    detachMidiHandler
  );

  // Chord identification logic
  const chordNotes = playedNotes.map(noteData => noteData.note);
  const chord = Chord.detect(chordNotes).join(', ') || 'No chord detected';

  if (!midiSupported) {
    return (
      <div className="midi-input">
        <div>Your browser does not support Web MIDI API.</div>
      </div>
    );
  }

  return (
    <div className="midi-input">
      <p className="midi-status">MIDI Inputs: {midiInputs.length}</p>
      <button 
        onClick={resetNotes}
        className="recording-button recording-button--idle"
      >
        Reset Notes
      </button>
      <div className="recording-status">
        {playedNotes.length > 0 ? (
          <>
            <p>Notes: {playedNotes.map(noteData => noteData.note).join(', ')}</p>
            <p>Chord: {chord}</p>
          </>
        ) : (
          <p>No notes played yet</p>
        )}
      </div>
    </div>
  );
}

export default MidiInput;