import { useEffect, useState } from "react";
import { TimerProvider } from "./TimerContext";
import TopMenu from "./components/TopMenu";
import CreateSession from "./components/CreateSession";
import Sessions from "./components/Sessions";
import CreateGoal from "./components/CreateGoal";
import Goals from "./components/Goals";
import { Session } from "react-router-dom";

function App() {
    const [sessions, setSessions] = useState<Session[]>([]);
    const [goals, setGoals] = useState<Goal[]>([]);

    async function fetchSessions(){
        const res = await fetch("http://127.0.0.1:8000/api/list-sessions/")
        const data = await res.json();
        setSessions(data);
    }

    async function createSession(session: Session) {
        await fetch("https://127.0.0.1:8000/api/create-session/", {
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(session)
        });
        setSessions(prev => [...prev, session])
    }

    async function editSession(id: string, updatedSession:Session) {
        try {
            const res = await fetch(`http://127.0.0.1:8000/api/edit-session/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedSession),
            });

            if (!res.ok) {
                throw new Error('Failed to update session');
            }

            const data = await res.json();
            return data;
        } catch (error) {
            console.error('Error editing session.', error)
            throw error;
        }
            
    }
    
    async function removeSession(id: string) {
        await fetch(`http://127.0.0.1:8000/api/edit-session/${id}`, { method: "DELETE" });
        setSessions(prev => prev.filter(s => s.id !== id));
    }

    useEffect(() => {
        fetchSessions();
    }, []);



    return (
        <>
            <TimerProvider>
                <TopMenu />
                <CreateSession addSession={createSession} />
                <Sessions sessions={sessions} removeSessions={removeSessions} />
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

