import TopMenu from "../components/topMenu";
import "./login.css"
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Register() {
    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [message, setMessage] = useState<string | null>(null);

    const navigate = useNavigate();

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        
        try {
            const response = await fetch('http://127.0.0.1:8000/api/register/', {
                method: 'POST',
                headers: {
                    'Content-Type':'application/json',
                },
                body: JSON.stringify({username, email, password})
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || 'Registration failed')
            }

            setMessage('Usuário registrado com sucesso!')
            navigate('login/');
        } catch (err) {
            setMessage((err as Error).message);
        }
    }

    function sendToLogin (){
      navigate('/login')
    }

    return (
        <>
        <TopMenu/>
        <div style={{ padding: '2rem' }} id="register__div">
          <h2 id="register__title">Registro</h2>
          <form onSubmit={handleRegister} id="register__form">
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={e => setUsername(e.target.value)}
              required
            />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
            <button type="submit">Registrar</button>
            <p>Já é registrado? faça o <strong onClick={sendToLogin}>Login</strong></p>
          </form>
          {message && <p>{message}</p>}
        </div>
        </>
      );
}

export default Register