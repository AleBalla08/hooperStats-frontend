import TopMenu from "../components/topMenu";
import "./login.css"
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Login(){
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState<string | null>(null);

    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
    
        try {
            const response = await fetch('http://127.0.0.1:8000/api/login/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password })
            });
    
            const responseText = await response.text();
    
            console.log('Resposta da API:', responseText);

            if (!response.ok) {
                throw new Error('Erro ao fazer login: ' + responseText);
            }

            const data = JSON.parse(responseText);
    
            localStorage.setItem('access_token', data.access_token);
            
            setMessage('Usuário logado com sucesso!');
            navigate('/profile');
        } catch (err) {
            setMessage((err as Error).message);
        }
    };
    



    return (
        <>
        <TopMenu/>
        <div style={{ padding: '2rem' }} id="login__div">
          <h2 id="login__title">Login</h2>
          <form onSubmit={handleLogin} id="login__form">
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={e => setUsername(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
            <button type="submit">Logar</button>
            <p>Ainda não é registrado? faça o <strong>Registro</strong></p>
            {message && <p style={{ color: "orange" }}>{message}</p>}

          </form>
          
        </div>
        </>
      );

}

export default Login
