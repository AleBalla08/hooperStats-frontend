import { useState } from 'react';
import '../comps_styles/appStyles.css'


interface createGoalProps {
    addGoal: (goalName: string, checked: boolean) => void;
}

function CreateGoal({addGoal}:createGoalProps){

    const [goalName, setGoalName] = useState<string>("");

    function criaMeta() {
        if (!goalName.trim()) return;

        addGoal(goalName, false);
        setGoalName("");
    }

    return (
        <div className='goals__container'>
            <h1 className='metas__title'>Metas</h1>
            <div className='createDiv'>
                <input 
                    className='input__session'
                    type="text" 
                    placeholder="Nome da Meta"
                    value={goalName}
                    onChange={(e) => setGoalName(e.target.value)}
                />
                <button className='goals__btn' onClick={criaMeta}>
                    <i className="fa-solid fa-plus"></i>
                </button>
            </div>
            
        </div>
    )
}

export default CreateGoal ;