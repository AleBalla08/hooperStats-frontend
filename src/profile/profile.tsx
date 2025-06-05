import './profile.css'
import TopMenu from '../components/topMenu';
import Dashboard from './porfile_comps/dashboard';
import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { Exercise } from '../components/types';
// import { useAuth } from './AuthContext';


function Profile() {

    const [lastDoneSession, setLastDoneSession] = useState<any | null>(null);
    const access_token = localStorage.getItem('access_token');
    const navigate = useNavigate();

    async function testAuthentication(){
        const token = localStorage.getItem('access_token');
        const res = await fetch("http://127.0.0.1:8000/api/protected/", {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        if (res.status === 403) {
            const refreshResponse = await fetch("http://127.0.0.1:8000/api/token/refresh/", {
                method: 'POST',
                credentials: 'include'
            });

            if (refreshResponse.ok) {
                const {access_token: newToken } = await refreshResponse.json();
                localStorage.setItem('access_token', newToken);

                const retry = await fetch("http://127.0.0.1:8000/api/protected/", {
                    headers: {
                        'Authorization': `Bearer ${newToken}`
                    }
                });

                const retryData = await retry.json();
                console.log('Dados Refresh: ', retryData);

            } else {
                navigate('/login')
            }


        }
    }

    async function getLastDoneSession() {
        const res = await fetch(`http://127.0.0.1:8000/api/get-done-sessions/`, {
            method: 'GET',
            headers: {
                'Content-Type' : 'application/json',
                'Authorization' : `Bearer ${access_token}`
            }
        })

        if (!res.ok) {
            return;
        }

        const data = await res.json();

        return data[data.length - 1];
    }

    useEffect(() => {
        async function fetchLastSession() {
            const data = await getLastDoneSession();
            setLastDoneSession(data);
            console.log('last', data);
        }

        fetchLastSession();
        testAuthentication();
    }, []);


    

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
                                {lastDoneSession.exercises?.map((exercise: Exercise, index: number) => (
                                    <li key={index}>
                                        {exercise.name} - {exercise.reps} reps - {exercise.makes} acer. - {exercise.accuracy}%
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