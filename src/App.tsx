import './comps_styles/appStyles.css';
import TopMenu from './components/topMenu';
import CreateSession from './components/createSession';
import Sessions from './components/sessions';
import CreateGoal from './components/createGoal';
import Goals from './components/goals';
import { useEffect, useState } from 'react';
import { Session, Goal } from './components/types';
import { TimerProvider } from './singleSession/SScomps/timerContexts';

function App() {
    const [sessions, setSessions] = useState<Session[]>(() => {
        const savedSessions = JSON.parse(localStorage.getItem("sessions") || "[]");
        return savedSessions;
    });

    const [goals, setGoals] = useState<Goal[]>(() => {
        const storedGoals = localStorage.getItem("goals");
        return storedGoals ? JSON.parse(storedGoals) : [];
    });

    useEffect(() => {
        localStorage.setItem("goals", JSON.stringify(goals));
    }, [goals]);

    useEffect(() => {
        localStorage.setItem("sessions", JSON.stringify(sessions));
    }, [sessions]);

    function addSession(session: Session) {
        setSessions([...sessions, session]);
    }

    function removeSessions(id: string) {
        const newSessions = sessions.filter(session => session.id !== id);
        setSessions(newSessions);
    }

    function addGoal(goalName: string, checked: boolean) {
        const newGoal = [...goals, { name: goalName, checked }];
        setGoals(newGoal);
    }

    function removeGoal(index: number) {
        const newGoals = goals.filter((_, i) => i !== index);
        setGoals(newGoals);
    }

    function toggleGoal(index: number) {
        const updatedGoals = goals.map((goal, i) =>
            i === index ? { ...goal, checked: !goal.checked } : goal
        );
        setGoals(updatedGoals);
    }

    function removeCheckedGoals(): void {
        const newGoals = goals.filter(goal => !goal.checked);
        setGoals(newGoals);
    }

    return (
        <>
            <TimerProvider>
                <TopMenu />
                <CreateSession addSession={addSession} />
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

