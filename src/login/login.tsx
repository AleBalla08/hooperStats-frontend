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
                    'Content-Type':'application/json',
                },
                body: JSON.stringify({username, password})
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || 'Login failed')
            }

            setMessage('Usuário logado com sucesso!')
            navigate('profile/');
        } catch (err) {
            setMessage((err as Error).message);
        }
    }



    return (
        <>
        <TopMenu/>
        <div style={{ padding: '2rem' }} id="register__div">
          <h2 id="register__title">Registro</h2>
          <form id="register__form">
            <button type="submit">Registrar</button>
            <p>Já é registrado? faça o <a href="#">Login</a></p>
          </form>
        </div>
        </>
      );

}

export default Login
