import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Container } from '@mui/material';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import TierListCreate from './pages/TierListCreate';
import TierListView from './pages/TierListView';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Register from './pages/Register';

function App() {
  return (
    <div className="App">
      <Navbar />
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/create" element={<TierListCreate />} />
          <Route path="/tier-list/:id" element={<TierListView />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </Container>
    </div>
  );
}

export default App;