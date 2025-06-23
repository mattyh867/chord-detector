import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Nav from './components/Nav'
import Staff from './components/Staff'
import MidiInput from './components/MidiInput'

function App() {
  const [count, setCount] = useState(0)
  const handleMidiNote = (note, velocity) => {
  }

  return (
    <>
      <div>
        <MidiInput onMidiNote={handleMidiNote} />
        <Staff/>
      </div>
    </>
  )
}

export default App
