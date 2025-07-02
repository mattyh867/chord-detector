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
    <>
      <div>
        <MidiInput 
          onMidiNote={handleMidiNote} 
          playedNotes={playedNotes} 
          resetNotes={resetNotes} 
        />
        <Keyboard onNotePlay={handleMidiNote} playedNotes={playedNotes} />
      </div>
    </>
  )
}

export default App
