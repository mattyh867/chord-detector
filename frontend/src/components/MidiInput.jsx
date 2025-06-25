import '../styles/MidiInput.css';
import { useMidiAccess } from '../hooks/useMidiAccess';
import { useMidiTracking } from '../hooks/useMidiRecording';

function MidiInput({ onMidiNote, playedNotes, resetNotes }) {
  const { midiSupported, midiInputs, attachMidiHandler, detachMidiHandler } = useMidiAccess();
  
  // Set up MIDI tracking without internal state
  useMidiTracking(
    onMidiNote,
    attachMidiHandler,
    detachMidiHandler
  );

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
            <p>Played {playedNotes.length} notes</p>
            <p>Notes: {playedNotes.map(noteData => noteData.note).join(', ')}</p>
          </>
        ) : (
          <p>No notes played yet</p>
        )}
      </div>
    </div>
  );
}

export default MidiInput;