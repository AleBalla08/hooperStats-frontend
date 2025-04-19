import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { HashRouter as Router, Routes, Route } from 'react-router-dom'; 
import App from './App';
import SingleSession from './singleSession/singleSession';
import Profile from './profile/profile';
import DoneSessions from './components/doneSessions'; 

const Main = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/singleSession/:sessionId" element={<SingleSession />} /> 
        <Route path="/profile" element={<Profile />} />
        <Route path="/workouts" element={<DoneSessions/>}/>
      </Routes>
    </Router>
  );
};

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Main /> 
  </StrictMode>
);
