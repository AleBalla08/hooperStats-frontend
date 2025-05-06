import '../comps_styles/appStyles.css';
import { Goal } from './types';


interface GoalsProps {
    goals: Goal[];
    removeGoal: (id: string) => void;
    toggleGoal: (id: string, checked: boolean) => void;
}

function Goals({ goals, removeGoal, toggleGoal }: GoalsProps) {
    return (
        <div className='div_goals'>
            <ul className='list-goals__container'>
                {goals.map((goal, index) => (
                    <li key={index} className='goals__item'>
                        <p>{goal.name}</p>
                        <div className='session__buttons'>
                            <input 
                                type="checkbox" 
                                className='goal__input'
                                checked={goal.checked}
                                onChange={() => toggleGoal(index)} 
                            />
                            <i className='fa fa-basketball checkball'></i>
                            <button className='remove__goal' onClick={() => removeGoal(index)}>
                                <i className="fa-solid fa-trash-can"></i>
                            </button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default Goals;
