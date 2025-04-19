import '../comps_styles/appStyles.css'
import { useEffect, useState } from "react";
import TopMenu from './topMenu';

function DoneSessions(){
    const [doneSessions, setDoneSessions] = useState<any | null>(null);

    useEffect(() => {
        const getDoneSessions = (): any | null => {
            const storedSessions = localStorage.getItem('doneSessions');

            if (!storedSessions) return null;
            return JSON.parse(storedSessions);
        };

        setDoneSessions(getDoneSessions());
    }, []);

    const clearDoneSessions = ()=>{
        localStorage.removeItem('doneSessions')
        setDoneSessions([])
    }



    return (
        <>
            <TopMenu/>
            <h3 className='done-sessions_title'>Treinos</h3>
            <h5 className='done-sessions-subtitle'>Treinos concluídos aparecerão aqui</h5>
            <ul className='done-sessions_list'>
                {doneSessions && doneSessions.map((session: any, index: number) => (
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