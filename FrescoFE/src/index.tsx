/**
 * index.tsx
 *
 * This is the entry file for the application, only setup and boilerplate
 * code.
 */

import 'react-app-polyfill/ie11';
import 'react-app-polyfill/stable';

import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import * as serviceWorker from 'serviceWorker';
import axios from 'axios';
import 'sanitize.css/sanitize.css';
import './index.less';

// Import root app
import { App } from 'app';

import { BrowserRouter } from 'react-router-dom';

import { HelmetProvider } from 'react-helmet-async';

import { configureAppStore } from 'store/configureStore';
import History from './services/History';

const store = configureAppStore();
const MOUNT_NODE = document.getElementById('root') as HTMLElement;

axios.defaults.baseURL = process.env.REACT_APP_BASE_URL;
axios.interceptors.response.use(
  response => {
    return response;
  },
  error => {
    if (!error.response) {
      error.response = {
        data: 'Network error',
        status: 500,
      };
    }
    if (error.response.status === 401) {
      localStorage.clear();
      History.push('/auth/login');
      throw error;
    }
    return Promise.reject(error);
  },
);

interface Props {
  Component: typeof App;
}
const ConnectedApp = ({ Component }: Props) => (
  <Provider store={store}>
    <HelmetProvider>
      <React.StrictMode>
        <BrowserRouter>
          <Component />
        </BrowserRouter>
      </React.StrictMode>
    </HelmetProvider>
  </Provider>
);
const render = (Component: typeof App) => {
  ReactDOM.render(<ConnectedApp Component={Component} />, MOUNT_NODE);
};

if (module.hot) {
  // Hot reloadable translation json files and app
  // modules.hot.accept does not accept dynamic dependencies,
  // have to be constants at compile-time
  module.hot.accept(['./app'], () => {
    ReactDOM.unmountComponentAtNode(MOUNT_NODE);
    const App = require('./app').App;
    render(App);
  });
}

render(App);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
