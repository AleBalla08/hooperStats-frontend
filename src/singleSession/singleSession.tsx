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
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [exerciseName, setExerciseName] = useState<string>("");
  const [reps, setReps] = useState<string>("");
  const [makes, setMakes] = useState<string>("");
  const { time, stopTimer } = useTimer(); 
  const navigate = useNavigate();
  const access_token = localStorage.getItem('access_token');

  // teste requisicao abaixo
    async function testAuthentication(){
        const token = localStorage.getItem('access_token');
        const res = await fetch("http://127.0.0.1:8000/api/protected/", {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        if (res.status === 403) {
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

    const authHeader = {
        'Content-Type' : 'application/json',
        'Authorization' : `Bearer ${access_token}`
    }

  async function fetchSessionDataAgain() {
    if (!access_token || !sessionId) return;
    
    const res = await fetch(`http://127.0.0.1:8000/api/session/?id_session=${sessionId}`, {
      headers: authHeader
    });
  
    if (res.ok) {
      const data = await res.json();
      console.log('data', data)
      setSession(data.session);
    }
  }
  
  useEffect(()=>{
    async function getSession(){
      const access_token = localStorage.getItem("access_token");

      if (!access_token) {
        console.error('Token não encontrado')
        return
      }

      try {
        const res = await fetch(`http://127.0.0.1:8000/api/session/?id_session=${sessionId}`, {
          headers: authHeader
        });

        if (!res.ok) {
          console.error('Sessão Não Encontrada.')
          return
        }

        const data = await res.json()
        setSession(data.session)
      } catch (err) {
        console.error('Erro: ', err)
      }
    }

    getSession()


  }, [sessionId, access_token])

  async function deleteExercise(sessionId: string, index: number) {
    if (!sessionId) {console.log('Sessão não encontrada')};

    const access_token = localStorage.getItem("access_token");
    const exercise = exercises[index];

    if (!access_token || !exercise) return;

    try {
      const res = await fetch(`http://127.0.0.1:8000/api/edit-exercise/${exercise.id}`, {
        method: 'DELETE',
        headers: {
          "Authorization": `Bearer ${access_token}`
        }
      });

      const data = await res.json();

      if (res.ok) {
        console.log("Exercício deletado com sucesso");

        setExercises((prevExercises) =>
          prevExercises.filter((_, i) => i !== index)
        );

      } else {
        console.error("Erro ao deletar exercício", data.message);
      }
    } catch (err) {
      console.error("Erro", err);
    }
  }



  async function addExercise(){
    console.log('id', sessionId)
    if (!sessionId || !exerciseName.trim()) return;

    const access_token = localStorage.getItem("access_token");

    if (!access_token) {
      console.error("Token de acesso não encontrado");
      return;
    }

    try {
      const res = await fetch(`http://127.0.0.1:8000/api/create-exercise/`, {
        method: 'POST',
        headers: authHeader,
        body: JSON.stringify({
          name: exerciseName,
          reps: Number(reps),
          session_id: Number(sessionId)
        })
      });

      const data = await res.json();

      if (!res.ok) {
        console.error('Erro ao criar exercicio', data)
        return;
      }

      console.log('data', data.data)

      setExercises((prevExercises) => [...prevExercises, data.data]);

      setSession((prev) =>
        prev ? {
          ...prev,
          exercises: [...(prev.exercises || []), data.data]
        } : prev
      );

      setExerciseName("");
      setReps("");
      setMakes("");

    } catch (err) {
      console.error('erro', err)
    }

  }

  async function listExercises(){
    if (!sessionId) return;

    const access_token = localStorage.getItem("access_token");

    if (!access_token) {
      console.error("Token de acesso não encontrado");
      return;
    }

    try {
      const res = await fetch(`http://127.0.0.1:8000/api/session/?id_session=${Number(sessionId)}`, {
        method: 'GET',
        headers: authHeader
      });


      const data = await res.json();

      console.log('data: ', data)

      if (!res.ok) {
        console.error('Erro ao listar exercícios', data)
        return;
      }

      setExercises(data.exercises);

      // await fetchSessionDataAgain();

      return data;

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

    const res = await fetch(`http://127.0.0.1:8000/api/session/?id_session=${Number(sessionId)}`);
    const data = await res.json();
    const savedSessions: Session[] = data;

    const updatedSessions = savedSessions.map((s) => (s.id === sessionId ? updatedSession : s));

    setSession(updatedSessions[updatedSessions.length - 1]);
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

  useEffect(() => {
        testAuthentication(); 
        listExercises();
  }, []);

  

  

  function toggleForm() {
    const form = document.querySelector(".form__exercise");
    const icon = document.querySelector(".toggleFormBtn");
  
    if (!form || !icon) return;
  
    form.classList.toggle("open");
    icon.classList.toggle("fa-angle-down");
    icon.classList.toggle("fa-angle-up");
  }

  if (!session) return <p style={
    {color: "white", 
    position: "absolute", 
    left: "50%", top: "50%", 
    transform:"translate(-50%, -50%)", 
    textAlign: "center"}}>
      Desculpe... A sessão a qual está buscando não pôde ser encontrada
    </p>;

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
      {exercises.length > 0 ? (
        <ul className="exercises__list">
          {exercises.map((exercise, index) => (
            <li className="exercise" key={index}>
              <div className="exercise__title" data-exercise-index={index}>
                {exercise.name} - {exercise.reps} Reps | {exercise.makes || '0'} acert. - {exercise.percentage != undefined ? exercise.percentage+'%' : '%'}
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
                <button className="edit__exer">
                  <i className="fa-solid fa-pen-to-square"></i>
                </button>
                <button className='remove__exer' onClick={() => deleteExercise(session.id, index)}>
                    <i className="fa-solid fa-trash-can"></i>
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
