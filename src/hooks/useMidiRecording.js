import { useState, useCallback, useEffect } from 'react';

const MIDI_NOTE_ON = 144;

const createNoteData = (note, velocity) => ({
  note,
  velocity,
  timestamp: performance.now()
});

export const useMidiTracking = (onMidiNote, attachMidiHandler, detachMidiHandler) => {
  const handleMidiMessage = useCallback((msg) => {
    const [status, note, velocity] = msg.data;
    
    if (status !== MIDI_NOTE_ON || velocity === 0) {
      return;
    }

    onMidiNote?.(note, velocity);
  }, [onMidiNote]);

  useEffect(() => {
    attachMidiHandler(handleMidiMessage);

    return () => {
      detachMidiHandler();
    };
  }, [handleMidiMessage, attachMidiHandler, detachMidiHandler]);
};