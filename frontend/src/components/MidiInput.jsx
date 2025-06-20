import { useEffect, useState } from 'react';

function MidiInput({ onMidiNote }) {
  const [midiSupported, setMidiSupported] = useState(false);
  const [midiInputs, setMidiInputs] = useState([]);

  useEffect(() => {
    if (navigator.requestMIDIAccess) {
      setMidiSupported(true);
      navigator.requestMIDIAccess().then((midiAccess) => {
        const inputs = Array.from(midiAccess.inputs.values());
        setMidiInputs(inputs);

        inputs.forEach(input => {
          input.onmidimessage = (msg) => {
            const [status, note, velocity] = msg.data;
            // 144 = note on, 128 = note off
            if (status === 144 && velocity > 0) {
              onMidiNote && onMidiNote(note, velocity);
            }
          };
        });
      });
    }
  }, [onMidiNote]);

  if (!midiSupported) {
    return <div>Your browser does not support Web MIDI API.</div>;
  }

  return (
    <div>
      <p>MIDI Inputs: {midiInputs.length}</p>
    </div>
  );
}

export default MidiInput;