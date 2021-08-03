import React from 'react';
import { HashRouter as Router } from 'react-router-dom';
import { Routes } from './Routes';
import { Layout } from './Layout';

function App() {
  return (
    <Router>
      <Layout>
        <Routes></Routes>
      </Layout>
    </Router>
  );
}

export default App;
