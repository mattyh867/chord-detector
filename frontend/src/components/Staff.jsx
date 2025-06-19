import { useEffect, useRef, useState } from 'react';
import { Renderer, Stave, StaveNote, Voice, Formatter } from 'vexflow';
import '../styles/Staff.css'; // Ensure you have the correct path to your CSS file

function getRandomNote() {
  const noteNames = ['c', 'd', 'e', 'f', 'g', 'a', 'b'];
  const octaves = [4, 5]; // You can adjust octaves as needed
  const name = noteNames[Math.floor(Math.random() * noteNames.length)];
  const octave = octaves[Math.floor(Math.random() * octaves.length)];
  return `${name}/${octave}`;
}

function Staff() {
    const containerRef = useRef(null);
    const [notes, setNotes] = useState([]);

    // Generate random notes when the component mounts or when "Randomize" is clicked
    const randomizeNotes = () => {
        const newNotes = Array.from({ length: 4 }, () =>
            new StaveNote({ keys: [getRandomNote()], duration: 'q' })
        );
        setNotes(newNotes);
    };

    useEffect(() => { 
        if (containerRef.current && notes.length > 0) {
        containerRef.current.innerHTML = '';

        const renderer = new Renderer(containerRef.current, Renderer.Backends.SVG);
        renderer.resize(1000, 400);

        const context = renderer.getContext();
        const scale = 1.4;
        context.scale(scale, scale);

            
        const staffWidth = Math.floor(window.innerWidth * 0.9);
        renderer.resize(staffWidth, 600);

        const stave = new Stave(20, 40, 400);
        stave.addClef('treble').addTimeSignature('4/4');
        stave.setContext(context).draw();

        const voice = new Voice({ num_beats: 4, beat_value: 4 });
        voice.addTickables(notes);

        new Formatter().joinVoices([voice]).format([voice], 400);
        voice.draw(context, stave);
        }
    }, [notes]);

// Generate initial notes on mount
useEffect(() => {
randomizeNotes();
}, []);

  return (
    <div>
      <button onClick={randomizeNotes}>Randomize Notes</button>
      <div ref={containerRef} className='staff-container'></div>
    </div>
  );
}

export default Staff;