import React from 'react';
import { HashRouter as Router } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { Routes } from './Routes';
import { Layout } from './Layout';
import styles from './app.module.less';
import { Web3Provider } from './contexts';

function App() {
  return (
    <Router>
      <Web3Provider>
        <Layout>
          <Routes />
        </Layout>
      </Web3Provider>
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
