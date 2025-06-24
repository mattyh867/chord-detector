import { useState } from 'react'
import './styles/App.css'
import MidiInput from './components/MidiInput'
import Keyboard from './components/Keyboard'

function App() {
  const [count, setCount] = useState(0)
  const handleMidiNote = (note, velocity) => {
  }

  return (
    <>
      <div>
        <MidiInput onMidiNote={handleMidiNote} />
        <Keyboard onNotePlay={handleMidiNote} />
      </div>
    </>
  )
}

export default App
