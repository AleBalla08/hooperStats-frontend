export interface Goal {
  id: string;
  name: string;
  checked: boolean;
}

export interface Exercise {
  id: number,
  checked: boolean,
  name: string;
  reps: number;
  makes: number;
  accuracy: number;
}

export interface Session {
  id: string;
  name: string;
  exercises: Exercise[];
  duration: number;
}






