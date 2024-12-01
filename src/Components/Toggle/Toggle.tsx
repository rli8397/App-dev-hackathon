import './Toggle.css';
import { useState } from 'react';

type Props = {
    setView: (e: string)=> void
}
export default function Toggle({ setView }: Props) {
    const [toggleState, setToggleState] = useState(false);

    return (
        <div className="container">
            <div className="toggle-text">Student View</div>
            <button
                className={`toggle-btn ${toggleState ? 'toggled' : ''}`}
                onClick={()=>{
                    if (toggleState) {
                        setView('Teacher')
                    } else {
                        setView('Student')
                    }
                    setToggleState(!toggleState)
                }}
                aria-pressed={toggleState}
            >
                <div className="toggle-circle"></div>
            </button>
        </div>
    );
}
