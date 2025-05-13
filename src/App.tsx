import { useEffect, useState } from "react";
import { TimerProvider } from "./singleSession/SScomps/timerContexts.tsx";
import TopMenu from "./components/topMenu.tsx";
import CreateSession from "./components/createSession.tsx";
import Sessions from "./components/sessions.tsx";
import CreateGoal from "./components/createGoal.tsx";
import Goals from "./components/goals.tsx";
// import { Session } from "react-router-dom";
import { Goal, Session } from "./components/types";
import { useNavigate } from "react-router-dom";

function App() {
    const [sessions, setSessions] = useState<Session[]>([]);
    const [goals, setGoals] = useState<Goal[]>([]); 
    const access_token = localStorage.getItem('access_token');

    const navigate = useNavigate()

    // teste requisicao abaixo
    async function testAuthentication(){
        const token = localStorage.getItem('access_token');
        const res = await fetch("http://127.0.0.1:8000/api/protected/", {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        if (res.status === 401) {
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

    useEffect(()=>{
        testAuthentication();
    })

    const authHeader = {
        'Content-Type' : 'application/json',
        'Authorization' : `Bearer ${access_token}`
    }

    async function fetchSessions(){
        const res = await fetch("http://127.0.0.1:8000/api/list-sessions/", {
            headers: {
                "Authorization": `Bearer ${access_token}`
            }
        })
        const data = await res.json();
        setSessions(data);
    }

    async function fetchGoals(){
        const res = await fetch("http://127.0.0.1:8000/api/list-goals/", {
            headers : authHeader
        })
        const data = await res.json()
        setGoals(data)
    }

    async function createSession(session: Session) {
        await fetch("http://127.0.0.1:8000/api/create-session/", {
            method: 'POST',
            headers: authHeader,
            body: JSON.stringify(session)
        });
        setSessions(prev => [...prev, session])
    }

    async function addGoal(name: string, checked: boolean) {
        const newGoal: Goal = {
          id: crypto.randomUUID(),
          name,
          checked,
        };
      
        await fetch("http://127.0.0.1:8000/api/create-goal/", {
          method: 'POST',
          headers: authHeader,
          body: JSON.stringify(newGoal)
        });
      
        setGoals(prev => [...prev, newGoal]);
    }

    async function removeSession(id: string) {
        await fetch(`http://127.0.0.1:8000/api/remove-session/${id}`, { method: "DELETE", headers : authHeader });
        setSessions(prev => prev.filter(s => s.id !== id));
    }

    async function removeGoal(id: string): Promise<void> {
        await fetch(`http://127.0.0.1:8000/api/edit-goal/${id}`, {method: 'DELETE', headers:authHeader});
        setGoals(prev => prev.filter(s => s.id !== id ))
    }

    async function toggleGoal(id: string, checked: boolean) {
        await fetch(`http://127.0.0.1:8000/api/edit-goal/${id}`, {
            method: 'PATCH',
            headers: authHeader,
            body: JSON.stringify({ id, checked })
        });
    }

    async function removeCheckedGoals() {
        try {
            const res = await fetch('http://127.0.0.1:8000/api/clear-checked-goals/', {
                method: 'DELETE',
                headers: authHeader
            });
            
            if (!res.ok) {
                throw new Error('Erro ao remover tarefas concluídas');
            }

            setGoals(prevGoals => prevGoals.filter(goal => !goal.checked));
        } catch(error) {
            console.error('Erro: ', error)
        }
        
    }
    

    // async function editSession(id: string, updatedSession:Session) {
    //     try {
    //         const res = await fetch(`http://127.0.0.1:8000/api/edit-session/${id}`, {
    //             method: 'PUT',
    //             headers: {
    //                 'Content-Type': 'application/json',
    //             },
    //             body: JSON.stringify(updatedSession),
    //         });

    //         if (!res.ok) {
    //             throw new Error('Failed to update session');
    //         }

    //         const data = await res.json();
    //         return data;
    //     } catch (error) {
    //         console.error('Error editing session.', error)
    //         throw error;
    //     }
            
    // }
    
    
    useEffect(() => {
        fetchSessions();
        fetchGoals();
    }, []);



    return (
        <>
            <TimerProvider>
                <TopMenu />
                <CreateSession addSession={createSession} />
                <Sessions sessions={sessions} removeSessions={removeSession} />
                <CreateGoal addGoal={addGoal} />
                <Goals goals={goals} removeGoal={removeGoal} toggleGoal={toggleGoal} />
                {goals.length > 0 && (
                    <div className='limpar-concluidas'>
                        <button onClick={removeCheckedGoals}>Limpar Concluídas</button>
                    </div>
                )}
            </TimerProvider>
        </>
    );
}

export default App;

