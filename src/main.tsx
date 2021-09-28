import './polyfills';
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

import './base.less';
import './theme.less';

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root'),
);
