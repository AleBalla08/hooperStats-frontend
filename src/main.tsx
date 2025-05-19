import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom'; 
import App from './App';
import SingleSession from './singleSession/singleSession';
import Profile from './profile/profile';
import Register from './login/register.tsx';
import DoneSessions from './components/doneSessions'; 
import Login from './login/login.tsx';
import { useAuth, AuthProvider } from './authContext.tsx';

const Main = () => {
  const authenticated = useAuth()

  return (
    <Router>
      <Routes>
        {!authenticated ? (
          <>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="*" element={<Navigate to="/login" />} />
          </>
        ) : (
          <>
            <Route path="/" element={<App />} />
            <Route path="/singleSession/:sessionId" element={<SingleSession />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/workouts" element={<DoneSessions />} />
            <Route path="*" element={<Navigate to="/" />} />
          </>
        )}
      </Routes>
    </Router>
  );
};


createRoot(document.getElementById('root')!).render(
  <AuthProvider>
    <StrictMode>
      <Main /> 
    </StrictMode>
  </AuthProvider>
);
