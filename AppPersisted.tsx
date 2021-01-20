import React from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import configureStore from './store/configureStore';
const { persistor, store } = configureStore();

const AppPersisted = (props) => (
  <Provider store={store}>
    <PersistGate persistor={persistor}>
      {props.children}
    </PersistGate>
  </Provider>
);
export default AppPersisted;
