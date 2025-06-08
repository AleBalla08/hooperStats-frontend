import '../comps_styles/appStyles.css'
import { useEffect, useState } from "react";
import TopMenu from './topMenu';
import { Session, useNavigate } from 'react-router-dom';

function DoneSessions(){
    const [doneSessions, setDoneSessions] = useState<Session| null>(null);
    const navigate = useNavigate();
    const access_token = localStorage.getItem('access_token');

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

    async function getDoneSessions() {
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
        setDoneSessions(data);
    }

    useEffect(() => {
        getDoneSessions();
        testAuthentication();
    }, []);


    const clearDoneSessions = ()=>{
        
        fetch ('http://127.0.0.1:8000/api/clear-done-sessions/', {
            method: 'DELETE',
            headers: {
                'Content-Type' : 'application/json',
                'Authorization' : `Bearer ${access_token}`
            },
            body: JSON.stringify({ 'ids': doneSessions.map(e => e.id) })
        })
        .then(res => res.json())
        .then(data => {
            setDoneSessions([]);
            console.log('Deleted:', data);
        })
        .catch(err => console.error('Error:', err));
    }


    return (
        <>
            <TopMenu/>
            <h3 className='done-sessions_title'>Treinos</h3>
            <h5 className='done-sessions-subtitle'>Treinos concluídos aparecerão aqui</h5>
            <ul className='done-sessions_list'>
                {doneSessions && doneSessions.map((session: Session, index: number) => (
                    <li className='donse-sessions_item' key={index}>{session.name} - {session.duration} segundos</li>
                ))}
            </ul>
            {doneSessions && ( 
                <div className="limpar-treinos">
                    <button onClick={clearDoneSessions}>Limpar Treinos</button>
                </div>
            )}
            
        </>
    )
}

export default DoneSessions