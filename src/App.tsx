import { Provider } from 'jotai';
import { HashRouter as Router } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { Routes } from './Routes';
import { Layout } from './Layout';
import { AtomWatchers } from './atoms';

import {
  ApolloProvider,
  ERC20Provider,
  I18nProvider,
  MBoxContractProvider,
  NFTContractProvider,
  RSS3Provider,
  ThemeProvider,
  UploadProvider,
  Web3Provider,
} from './contexts';

import './base.less';
import './variables.less';
import './theme.module.less';
import styles from './app.module.less';

function App() {
  return (
    <Router>
      <ThemeProvider>
        <Provider>
          <I18nProvider>
            <UploadProvider>
              <Web3Provider>
                <AtomWatchers>
                  <ERC20Provider>
                    <ApolloProvider>
                      <NFTContractProvider>
                        <MBoxContractProvider>
                          <RSS3Provider>
                            <Layout>
                              <Routes />
                            </Layout>
                          </RSS3Provider>
                        </MBoxContractProvider>
                      </NFTContractProvider>
                    </ApolloProvider>
                  </ERC20Provider>
                </AtomWatchers>
              </Web3Provider>
              <Toaster
                position="top-right"
                containerClassName={styles.toastContainer}
                toastOptions={{
                  className: styles.toast,
                }}
              />
            </UploadProvider>
          </I18nProvider>
        </Provider>
      </ThemeProvider>
    </Router>
  );
}

export default App;
