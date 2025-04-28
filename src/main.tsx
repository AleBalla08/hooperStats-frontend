import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { HashRouter as Router, Routes, Route } from 'react-router-dom'; 
import App from './App';
import SingleSession from './singleSession/singleSession';
import Profile from './profile/profile';
import Register from './login/register.tsx';
import DoneSessions from './components/doneSessions'; 
import Login from './login/login.tsx';

const isAuthenticated = () => {
  return !!localStorage.getItem('access_token');
};

const Main = () => {
  const authenticated = isAuthenticated();

  return (
    <Router>
      <Routes>
        {!authenticated ? (
          <>
            <Route path="*" element={<Register />} />
          </>
        ) : (
          <>
            <Route path="/" element={<App />} />
            <Route path="/login" element={<Login/>}/>
            <Route path="/singleSession/:sessionId" element={<SingleSession />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/workouts" element={<DoneSessions />} />
          </>
        )}
      </Routes>
    </Router>
  );
};


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Main /> 
  </StrictMode>
);
