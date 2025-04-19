import '../SS.css'
import { useState, useEffect } from "react";
import { useTimer } from "./timerContexts"; 

function Timer() {
    const { time, setTime } = useTimer();
    const [isRunning, setIsRunning] = useState(false);

    useEffect(() => {
        let interval: ReturnType<typeof setTimeout> | undefined;

        if (isRunning) {
            interval = setInterval(() => {
                setTime((prev: number) => prev + 1);
            }, 1000);
        } 

        return () => {
            if (interval) clearInterval(interval);
        };
    }, [isRunning, setTime]); 

    const formatTime = (seconds: number) => {
        const minutes = Math.floor(seconds / 60)
            .toString()
            .padStart(2, "0");
        const secs = (seconds % 60).toString().padStart(2, "0");
        return `${minutes}:${secs}`;
    };

    return (
        <div className='timer__container'>
            <h1 className='timer'>{formatTime(time)}</h1>
            <div className='button__timer'>
                <button className='iniciar__timer' onClick={() => setIsRunning(true)}>
                    <i className="fa-solid fa-play"></i>
                </button>
                <button className='parar__timer' onClick={() => setIsRunning(false)}>
                    <i className="fa-solid fa-pause"></i>
                </button>
                <button className='limpar__timer' onClick={() => setTime(0)}>
                    <i className="fa-solid fa-rotate-right"></i>
                </button>
            </div>
        </div>
    );
}

export default Timer;
