import { HashRouter as Router } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { Routes } from './Routes';
import { Layout } from './Layout';

import { MBoxContractProvider, NFTContractProvider, ThemeProvider, Web3Provider } from './contexts';

import styles from './app.module.less';

import './base.less';
import './theme.module.less';

function App() {
  return (
    <Router>
      <ThemeProvider>
        <Web3Provider>
          <NFTContractProvider>
            <MBoxContractProvider>
              <Layout>
                <Routes />
              </Layout>
            </MBoxContractProvider>
          </NFTContractProvider>
        </Web3Provider>
        <Toaster
          position="top-right"
          containerClassName={styles.toastContainer}
          toastOptions={{
            className: styles.toast,
          }}
        />
      </ThemeProvider>
    </Router>
  );
}

export default App;
