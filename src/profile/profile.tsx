import './profile.css'
import TopMenu from '../components/topMenu';
import Dashboard from './porfile_comps/dashboard';
import { useEffect, useState } from "react";
// import { useAuth } from './AuthContext';


function Profile() {

    const [lastDoneSession, setLastDoneSession] = useState<any | null>(null);
    // const { setAuthenticated } = useAuth();

    useEffect(()=>{
        const getLastDoneSession = (): any | null => {
            const doneSession = localStorage.getItem('doneSessions')
    
            if (!doneSession) return null;
    
            try {
                const list: any[] = JSON.parse(doneSession)
                return list.length > 0 ? list[list.length - 1] : null;
            } catch (error){
                console.log('erro', error)
                return null;
            }
        }
        
        setLastDoneSession(getLastDoneSession())
    }, [])

    

    return (
        <>
        <TopMenu/>
        <div className='profile-container'>
            <div className="profile__header">
                <img src="./media/profile-default.svg" alt="" className="profile__pic" />
            </div>
            <div className="user_info">
                <h1 className='username'>Username</h1>
                <i className="fa-solid fa-user-pen"></i>
            </div>
            <div className='done_sessions_list'>
                <h1>Ultima Sessão Concluída:</h1>
                <div>
                    <div className='done_session_exer'>
                        {lastDoneSession ? (
                        <div className="done_session_exer">
                            <h3>{lastDoneSession.name + " - " + lastDoneSession.duration + " Segundos de duração"}</h3>
                            <ul>
                                {lastDoneSession.exercises?.map((exercise: any, index: number) => (
                                    <li key={index}>
                                        {exercise.name} - {exercise.reps} reps - {exercise.makes} acer. - {exercise.percentage}%
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ) : (
                        <p>Você não concluiu nenhuma sessão de treinamento.</p>
                    )}
                        
                    </div>
                </div>
            </div>
            <p className='obs'>OBS: estes gráficos ainda estão em desenvolvimento</p>
            <Dashboard></Dashboard>
        </div>
        </>
        
    )
}

export default Profile