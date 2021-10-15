import { HashRouter as Router } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { Routes } from './Routes';
import { Layout } from './Layout';

import {
  MBoxContractProvider,
  NFTContractProvider,
  RSS3Provider,
  ThemeProvider,
  UploadProvider,
  Web3Provider,
} from './contexts';
import './base.less';
import './theme.module.less';
import styles from './app.module.less';

function App() {
  return (
    <Router>
      <ThemeProvider>
        <UploadProvider>
          <Web3Provider>
            <NFTContractProvider>
              <MBoxContractProvider>
                <RSS3Provider>
                  <Layout>
                    <Routes />
                  </Layout>
                </RSS3Provider>
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
        </UploadProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;