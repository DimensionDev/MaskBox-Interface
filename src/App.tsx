import React from 'react';
import { HashRouter as Router } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { Routes } from './Routes';
import { Layout } from './Layout';
import styles from './app.module.less';

function App() {
  return (
    <Router>
      <Layout>
        <Routes />
      </Layout>
      <Toaster
        position="top-right"
        containerClassName={styles.toastContainer}
        toastOptions={{
          className: styles.toast,
        }}
      />
    </Router>
  );
}

export default App;
