import { useEffect, useRef } from 'react';
import { Factory } from 'vexflow';

const Staff = () => {
    const containerRef = useRef(null);

    useEffect(() => {
        if (containerRef.current) {
            // Clear any existing content
            containerRef.current.innerHTML = '';

            // Create VexFlow factory with dimensions
            const vf = new Factory({
                renderer: {
                    elementId: containerRef.current,
                    width: 1000,
                    height: 300
                }
            });

            // Get the rendering context
            const context = vf.getContext();
            context.scale(2, 2); // Scale the context if needed

            // Create a system (a group of staves)
            const score = vf.EasyScore();
            const system = vf.System();

            // Add a stave with some notes
            system
                .addStave({
                    voices: [
                        score.voice(score.notes('C#5/q, B4, A4, G#4', { stem: 'up' }))
                    ]
                })
                .addClef('treble')
                .addTimeSignature('4/4');

            // Draw it!
            vf.draw();
        }
    }, []); // Empty dependency array means this effect runs once on mount

    return (
        <div 
            ref={containerRef}
            className="staff"
            style={{ 
                width: '100%',
                maxWidth: '500px',
                margin: '20px auto'
            }}
        />
    );
};

export default Staff;