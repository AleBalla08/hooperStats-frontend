import '../comps_styles/appStyles.css'
import { Session } from './types';
import { useNavigate } from 'react-router-dom';

interface SessionProps{
    sessions: Session[];
    removeSessions: (id:string) => void;
}

function Sessions({sessions, removeSessions}:SessionProps){


  const navigate = useNavigate();

  const showSingleSession = (sessionId: string)=>{
        navigate(`/singleSession/${sessionId}`)
  }

    return (
        <div className='div_sessions'>
            <ul className='sessions__container'>
                {sessions.map((session, index) => (
                    <li key={index} className='session__item'>
                    <p>{session.name}</p>
                    <div className='session__buttons'>
                        <button className='start__session'  onClick={() => showSingleSession(session.id)}>Visualizar</button>
                        <button className='remove__session' onClick={() => removeSessions(session.id)}><i className="fa-solid fa-trash-can"></i></button>
                    </div>
                </li>
                ))}
                
            </ul>
        </div>
    )
}


export default Sessions;