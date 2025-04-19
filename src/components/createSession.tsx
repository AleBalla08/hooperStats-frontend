import '../comps_styles/appStyles.css';
import { useState } from 'react';
import { Session } from './types';
import { v4 as uuidv4 } from 'uuid';

interface CreateSessionProps {
    addSession: (session: Session) => void;
}

function CreateSession({ addSession }: CreateSessionProps) {
    const [sessionName, setSessionName] = useState<string>("");

    function criaTreino() {
        if (!sessionName.trim()) return;

        const newSession: Session = {
            id: uuidv4(), 
            name: sessionName,
            exercises: [], 
            duration: 0, 
        };

        addSession(newSession);
        setSessionName("");
    }

    return (
        <div className='register__container'>
            <h1 className='sessions__title'>Sessões</h1>
            <div className='createDiv'>
                <input 
                    className='input__session'
                    type="text" 
                    placeholder="Nome do treino"
                    value={sessionName}
                    onChange={(e) => setSessionName(e.target.value)}
                />
                <button className='register__btn' onClick={criaTreino}>
                    <i className="fa-solid fa-plus"></i>
                </button>
            </div>
        </div>
    );
}

export default CreateSession;


