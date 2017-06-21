import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import injectTapEventPlugin from 'react-tap-event-plugin';
import configureStore from './store/configureStore';
import Routes from './Routes';
import registerServiceWorker from './registerServiceWorker';
import { refreshTypes } from './services/types-service';
import { refreshSchema } from './services/context-service';
import { getKeys } from './store/ducks/keys';

injectTapEventPlugin();

let store = configureStore({});

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.onmessage = (event) => {
    if (event.data === 'refresh') {
      refreshTypes();
      refreshSchema();
      store.dispatch(getKeys());
    }
  };
}

ReactDOM.render(
  <Provider store={store}>
    <Routes />
  </Provider>,
  document.getElementById('root'),
);

registerServiceWorker();
