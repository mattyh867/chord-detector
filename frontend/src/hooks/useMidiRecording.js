import { useState, useCallback, useEffect } from 'react';

const MIDI_NOTE_ON = 144;

const createNoteData = (note, velocity) => ({
  note,
  velocity,
  timestamp: performance.now()
});

export const useMidiTracking = (onMidiNote, attachMidiHandler, detachMidiHandler) => {
  const [playedNotes, setPlayedNotes] = useState([]);

  const handleMidiMessage = useCallback((msg) => {
    const [status, note, velocity] = msg.data;
    
    if (status !== MIDI_NOTE_ON || velocity === 0) {
      return;
    }

    setPlayedNotes(prev => {
      const noteExists = prev.some(noteData => noteData.note === note);
      if (noteExists) {
        return prev;
      }
      const noteData = createNoteData(note, velocity);
      return [...prev, noteData];
    });
    onMidiNote?.(note, velocity);
  }, [onMidiNote]);

  useEffect(() => {
    attachMidiHandler(handleMidiMessage);

    return () => {
      detachMidiHandler();
    };
  }, [handleMidiMessage, attachMidiHandler, detachMidiHandler]);

  useEffect(() => {
    console.log('Current played notes:', playedNotes);
  }, [playedNotes]);

  const resetNotes = useCallback(() => {
    setPlayedNotes([]);
  }, []);

  return {
    playedNotes,
    resetNotes
  };
};