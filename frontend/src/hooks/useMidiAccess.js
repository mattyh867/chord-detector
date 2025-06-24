import { useEffect, useState, useCallback } from 'react';

export const useMidiAccess = () => {
  const [midiSupported, setMidiSupported] = useState(false);
  const [midiInputs, setMidiInputs] = useState([]);
  const [midiAccess, setMidiAccess] = useState(null);

  useEffect(() => {
    let access = null;
    
    const initializeMidi = async () => {
      if (!navigator.requestMIDIAccess) {
        return;
      }

      try {
        setMidiSupported(true);
        access = await navigator.requestMIDIAccess();
        setMidiAccess(access);
        
        const inputs = Array.from(access.inputs.values());
        setMidiInputs(inputs);
      } catch (error) {
        console.error('Failed to access MIDI devices:', error);
        setMidiSupported(false);
      }
    };

    initializeMidi();

    return () => {
      if (access) {
        const inputs = Array.from(access.inputs.values());
        inputs.forEach(input => {
          input.onmidimessage = null;
        });
      }
    };
  }, []);

  const attachMidiHandler = useCallback((handler) => {
    if (!midiAccess) return;

    midiInputs.forEach(input => {
      input.onmidimessage = handler;
    });
  }, [midiAccess, midiInputs]);

  const detachMidiHandler = useCallback(() => {
    if (!midiAccess) return;

    midiInputs.forEach(input => {
      input.onmidimessage = null;
    });
  }, [midiAccess, midiInputs]);

  return {
    midiSupported,
    midiInputs,
    attachMidiHandler,
    detachMidiHandler
  };
};