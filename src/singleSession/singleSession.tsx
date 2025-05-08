import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Exercise, Session } from "../components/types";
import TopMenu from "../components/topMenu";
import "./SS.css";
import Timer from "./SScomps/timer";
import Swal from "sweetalert2";
import { TimerProvider, useTimer } from "./SScomps/timerContexts";
import { useNavigate } from "react-router-dom";

function SingleSession() {
  return (
    <TimerProvider>
      <SingleSessionContent />
    </TimerProvider>
  );
}




function SingleSessionContent() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const [session, setSession] = useState<Session | null>(null);
  const [exerciseName, setExerciseName] = useState<string>("");
  const [reps, setReps] = useState<string>("");
  const [makes, setMakes] = useState<string>("");
  const { time, stopTimer } = useTimer(); 
  const navigate = useNavigate();
  const access_token = localStorage.getItem('access_token');

  async function fetchSessionDataAgain() {
    if (!access_token || !sessionId) return;
    
    const res = await fetch(`http://127.0.0.1:8000/api/sessions/${sessionId}/`, {
      headers: {
        "Authorization": `Bearer ${access_token}`,
        "Content-Type": "application/json"
      }
    });
  
    if (res.ok) {
      const data = await res.json();
      setSession(data);
    }
  }
  
  useEffect(()=>{
    async function getSession(){
      if (!access_token) {
        console.error('Token não encontrado')
        return
      }

      try {
        const res = await fetch(`http://127.0.0.1:8000/api/session/${sessionId}/`, {
          headers: {
            "Authrization" : `Bearer ${access_token}`,
            "Content-Type" : "application/json"
          }
        });

        if (!res.ok) {
          console.error('Sessão Não Encontrada.')
          return
        }

        const data = await res.json()
        setSession(data)
      } catch (err) {
        console.error('Erro: ', err)
      }
    }

    getSession()


  }, [sessionId, access_token])


  async function addExercise(){
    if (!session || !exerciseName.trim()) return;

    const access_token = localStorage.getItem("access_token");

    if (!access_token) {
      console.error("Token de acesso não encontrado");
      return;
    }

    try {
      const res = await fetch(`http://127.0.0.1:8000/api/create-exercise/`, {
        method: 'POST',
        headers: {
            "Authrization" : `Bearer ${access_token}`,
            "Content-Type" : "application/json"
        },
        body: JSON.stringify({
          name: exerciseName,
          reps: Number(reps),
          session_id: session.id
        })
      });

      const data = await res.json();

      if (!res.ok) {
        console.error('Erro ao criar exercicio', data)
        return;
      }

      await fetchSessionDataAgain();

      setExerciseName("");
      setReps("");
      setMakes("");

    } catch (err) {
      console.error('erro', err)
    }

  }

  // function deleteExercise(sessionId: string, exerciseIndex: number) {
  //   if (!session) return;
  //   const updatedExercises = session.exercises.filter((_, index) => index !== exerciseIndex);
  //   const updatedSession = { ...session, exercises: updatedExercises };

  //   const savedSessions: Session[] = JSON.parse(localStorage.getItem("sessions") || "[]");
  //   const updatedSessions = savedSessions.map((s) => (s.id === sessionId ? updatedSession : s));

  //   localStorage.setItem("sessions", JSON.stringify(updatedSessions));
  //   setSession(updatedSession);
  // }

  async function deleteSession(id: number) {
    if (!session) return;

    const access_token = localStorage.getItem("access_token");

    if (!access_token) {
      console.error("Token de acesso não encontrado");
      return;
    }

    try {
      const res = await fetch(`http://127.0.0.1:8000/api/edit-exercise/${id}`, {
        method: 'DELETE',
        headers: {
          "Authrization" : `Bearer ${access_token}`
        }
      });

      const data = await res.json();

      if (res.ok) {
        console.log('Exercicio deletado com sucesso')
        await fetchSessionDataAgain()
      } else {
        console.error('Erro ao deletar sessao', data.message)
        return;
      }
    } catch (err) {
      console.error('erro', err)
    }
  }



  async function endExercise(sessionId: string, exerciseIndex: number) {
    if (!session) return;

    const updatedSession = { ...session };
    const exercise = updatedSession.exercises[exerciseIndex];

    if (!exercise) return;

    const { value: makes } = await Swal.fire({
      title: `De ${exercise.reps}, quantas você acertou?`,
      icon: "question",
      input: "range",
      inputLabel: "Acertos",
      inputAttributes: {
        min: "0",
        max: exercise.reps.toString(),
        step: "1",
      },
      inputValue: 0,
      showCancelButton: true,
    });

    if (makes === undefined) return;

    const parsedMakes = Number(makes);
    if (isNaN(parsedMakes) || parsedMakes < 0 || parsedMakes > exercise.reps) {
      Swal.fire("Erro!", "Por favor, insira um número válido.", "error");
      return;
    }

    exercise.checked = true;
    exercise.makes = parsedMakes;
    exercise.percentage = parseFloat(((parsedMakes / exercise.reps) * 100).toFixed(2));

    const savedSessions: Session[] = JSON.parse(localStorage.getItem("sessions") || "[]");
    const updatedSessions = savedSessions.map((s) => (s.id === sessionId ? updatedSession : s));

    localStorage.setItem("sessions", JSON.stringify(updatedSessions));

    setSession(updatedSession);
  }


  function endSession() {
    if (!session) return;
  
    stopTimer();
  
    const paraTimer = document.querySelector('.parar__timer') as HTMLButtonElement;
    if (paraTimer) {
      paraTimer.click();
    } else {
      console.warn("Botão de parar timer não encontrado.");
    }
  
    const doneSessions: Session[] = JSON.parse(localStorage.getItem("doneSessions") || "[]");
  
    const newSession: Session = {
      id: session.id,
      name: session.name,
      exercises: session.exercises.map((exercise) => ({
        ...exercise,
        checked: true, 
      })),
      duration: time,
    };
  
    doneSessions.push(newSession);
    localStorage.setItem("doneSessions", JSON.stringify(doneSessions));

    const resetSession: Session = {
      ...session,
      exercises: session.exercises.map((exercise) => ({
        ...exercise,
        makes: 0,
        percentage: 0,
        checked: false,
      })),
    };
  
    const storedSessions: Session[] = JSON.parse(localStorage.getItem("sessions") || "[]");
  
    const updatedSessions = storedSessions.map((s) => (s.id === session.id ? resetSession : s));
  
    localStorage.setItem("sessions", JSON.stringify(updatedSessions));
  
    setSession(resetSession);
  
    console.log("Sessão finalizada e salva em 'doneSessions':", newSession);
    
    
    const showProfile = ()=>{
            navigate(`/profile`)
    }

    Swal.fire({
      title: "Sessão salva com sucesso!",
      icon: "success",
      confirmButtonText: "OK",
    }).then(() => {
      showProfile()
    });
  }
  

  

  function toggleForm() {
    const form = document.querySelector(".form__exercise");
    const icon = document.querySelector(".toggleFormBtn");
  
    if (!form || !icon) return;
  
    form.classList.toggle("open");
    icon.classList.toggle("fa-angle-down");
    icon.classList.toggle("fa-angle-up");
  }

  if (!session) return <p>Sessão não encontrada</p>;

  return (
    <div>
      <TopMenu />
      <Timer />
      <h1 className="session_text_title">{session.name}</h1>
      <div className="toggle-form">
        <h3>Adicionar Exercício</h3>
        <i className="fa-solid fa-angle-down toggleFormBtn" onClick={toggleForm}></i>
      </div>
      <br />
      <div className="form__exercise">
        <input
          type="text"
          placeholder="Nome do exercício"
          value={exerciseName}
          onChange={(e) => setExerciseName(e.target.value)}
        />
        <input
          type="number"
          placeholder="Repetições"
          value={reps}
          onChange={(e) => setReps(e.target.value)}
        />
        <button onClick={addExercise}>Adicionar</button>
      </div>
      <br />
      <h2 className="exercises__title">Exercícios:</h2>
      {session.exercises.length > 0 ? (
        <ul className="exercises__list">
          {session.exercises.map((exercise, index) => (
            <li className="exercise" key={index}>
              <div className="exercise__title" data-exercise-index={index}>
                {exercise.name} - {exercise.reps} Reps | {exercise.makes || ''} acert. - {exercise.percentage+'%' || ''}
              </div>

              <label className="custom-checkbox">
                <input
                  checked={exercise.checked}
                  style={{ color: exercise.checked ? "orange" : "var(--branco)" }}
                  onChange={() => endExercise(session.id, index)}
                  className="checkbox__exer"
                  type="checkbox"
                />
                <i className="fas fa-basketball-ball bball-check"></i>
                <button className="remove__exer" onClick={() => deleteExercise(index)}>
                  <i className="fa-solid fa-trash-can"></i>
                </button>
                <button className="edit__exer">
                  <i className="fa-solid fa-pen-to-square"></i>
                </button>
              </label>
            </li>
          ))}
          <button className="end-session" onClick={endSession}>
            Finalizar Sessão
          </button>
        </ul>
      ) : (
        ""
      )}
    </div>
  );
}

export default SingleSession;
