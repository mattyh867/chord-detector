import { useState } from 'react'
import './styles/App.css'
import MidiInput from './components/MidiInput'

function App() {
  const [count, setCount] = useState(0)
  const handleMidiNote = (note, velocity) => {
  }

  return (
    <>
      <div>
        <MidiInput onMidiNote={handleMidiNote} />
      </div>
    </>
  )
}

export default App
