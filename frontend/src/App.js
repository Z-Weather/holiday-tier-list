import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Container } from '@mui/material';
import Navbar from './components/Navbar';
import HomeSimple from './pages/Home-Simple';
import TierListCreate from './pages/TierListCreate';
import TierListView from './pages/TierListView';
import TierListBuilder from './components/TierListBuilder';

function App() {
  return (
    <div className="App">
      <Navbar />
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Routes>
          <Route path="/" element={<HomeSimple />} />
          <Route path="/create" element={<TierListCreate />} />
          <Route path="/tier-list/:id" element={<TierListView />} />
          <Route path="/builder" element={<TierListBuilder />} />
        </Routes>
      </Container>
    </div>
  );
}

export default App;