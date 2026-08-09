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
  const chord = Chord.detect(chordNotes).join(', ') || 'Cannot detect chord';

  if (!midiSupported) {
    return (
      <div className="midi-input">
        <div className="midi-unsupported">
          Your browser does not support the Web MIDI API. You can still use the
          on-screen piano below.
        </div>
      </div>
    );
  }

  return (
    <div className="midi-input">
      <div className="midi-toolbar">
        <p className={`midi-status ${midiInputs.length === 0 ? 'midi-status--none' : ''}`}>
          {midiInputs.length} MIDI {midiInputs.length === 1 ? 'input' : 'inputs'} connected
        </p>
        <button
          onClick={resetNotes}
          className="recording-button"
          disabled={playedNotes.length === 0}
        >
          Reset notes
        </button>
      </div>
      <div className="recording-status">
        {playedNotes.length > 0 ? (
          <>
            <div className="readout">
              <p className="readout-label">Notes</p>
              <p className="readout-value">
                {playedNotes.map(noteData => noteData.note).join(', ')}
              </p>
            </div>
            <div className="readout">
              <p className="readout-label">Chord</p>
              <p className="readout-value readout-value--chord">{chord}</p>
            </div>
          </>
        ) : (
          <p className="readout-empty">
            Play some notes to identify a chord
          </p>
        )}
      </div>
    </div>
  );
}

export default MidiInput;