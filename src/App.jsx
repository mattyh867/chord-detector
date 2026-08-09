import { useState } from 'react'
import './styles/App.css'
import MidiInput from './components/MidiInput'
import Keyboard from './components/Keyboard'

function App() {
  const [playedNotes, setPlayedNotes] = useState([])
  
  const handleMidiNote = (note, velocity) => {
    const noteData = {
      note: `${['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'][note % 12]}${Math.floor(note / 12) - 1}`,
      midi: note,
      velocity,
      timestamp: Date.now()
    }
    setPlayedNotes(prev => {
      // Check if this MIDI note already exists
      const noteExists = prev.some(existingNote => existingNote.midi === note)
      if (noteExists) {
        return prev // Don't add duplicate
      }
      return [...prev, noteData]
    })
  }

  const resetNotes = () => {
    setPlayedNotes([])
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1 className="app-title">
          <img src="/piano.svg" alt="" />
          Chord Detector
        </h1>
        <p className="app-subtitle">
          Play notes on a MIDI keyboard or the piano below to identify the chord.
        </p>
      </header>

      <MidiInput
        onMidiNote={handleMidiNote}
        playedNotes={playedNotes}
        resetNotes={resetNotes}
      />
      <Keyboard onNotePlay={handleMidiNote} playedNotes={playedNotes} />
    </div>
  )
}

export default App
