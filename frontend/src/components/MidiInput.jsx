import { useEffect, useState } from 'react';

function MidiInput({ onMidiNote, onRecordingComplete }) {
  const [midiSupported, setMidiSupported] = useState(false);
  const [midiInputs, setMidiInputs] = useState([]);
  const [isRecording, setIsRecording] = useState(false);
  const [recordedNotes, setRecordedNotes] = useState([]);
  const [recordingStartTime, setRecordingStartTime] = useState(null);

  useEffect(() => {
    let midiAccess = null;
    
    if (navigator.requestMIDIAccess) {
      setMidiSupported(true);
      navigator.requestMIDIAccess().then((access) => {
        midiAccess = access;
        const inputs = Array.from(access.inputs.values());
        setMidiInputs(inputs);

        const handleMidiMessage = (msg) => {
          const [status, note, velocity] = msg.data;
          const timestamp = performance.now();
          
          // Only record if we're actively recording
          if (isRecording && status === 144 && velocity > 0) {
            // If this is the first note, set the recording start time
            if (recordingStartTime === null) {
              setRecordingStartTime(timestamp);
            }
            
            const relativeTime = recordingStartTime ? timestamp - recordingStartTime : 0;
            const noteData = {
              note,
              velocity,
              timestamp: relativeTime
            };
            
            setRecordedNotes(prev => [...prev, noteData]);
            onMidiNote && onMidiNote(note, velocity);
          }
        };

        inputs.forEach(input => {
          input.onmidimessage = handleMidiMessage;
        });
      });
    }

    // Cleanup function
    return () => {
      if (midiAccess) {
        const inputs = Array.from(midiAccess.inputs.values());
        inputs.forEach(input => {
          input.onmidimessage = null; // Remove event listener
        });
      }
    };
  }, [onMidiNote, isRecording, recordingStartTime]);

  const startRecording = () => {
    setIsRecording(true);
    setRecordedNotes([]);
    setRecordingStartTime(null); // Reset to null, will be set on first note
  };

  const stopRecording = () => {
    setIsRecording(false);
    setRecordingStartTime(null);
    onRecordingComplete && onRecordingComplete(recordedNotes);
    console.log('Recording stopped:', recordedNotes);
  };

  const toggleRecording = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  if (!midiSupported) {
    return <div>Your browser does not support Web MIDI API.</div>;
  }

  return (
    <div>
      <p>MIDI Inputs: {midiInputs.length}</p>
      <button 
        onClick={toggleRecording}
        style={{
          backgroundColor: isRecording ? '#ff4444' : '#44aa44',
          color: 'white',
          padding: '10px 20px',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
          fontSize: '16px'
        }}
      >
        {isRecording ? 'Stop Recording' : 'Start Recording'}
      </button>
      {recordedNotes.length > 0 && !isRecording && (
        <div>
          <p>Recorded {recordedNotes.length} notes</p>
        </div>
      )}
    </div>
  );
}

export default MidiInput;