import { createContext, useContext, useState, ReactNode } from "react";

interface TimerContextType {
    time: number;
    setTime: React.Dispatch<React.SetStateAction<number>>;
    stopTimer: () => void;
}

const TimerContext = createContext<TimerContextType | undefined>(undefined);

export function TimerProvider({ children }: { children: ReactNode }) {
    const [time, setTime] = useState(0);

    const stopTimer = () => {
        setTime(0);
    };

    return (
        <TimerContext.Provider value={{ time, setTime, stopTimer }}>
            {children}
        </TimerContext.Provider>
    );
}

export function useTimer() {
    const context = useContext(TimerContext);
    if (!context) {
        throw new Error("useTimer must be used within a TimerProvider");
    }
    return context;
}

