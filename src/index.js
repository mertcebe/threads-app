import React from 'react';
import ReactDOM from 'react-dom/client';
import AppRouter from './router/AppRouter';
import AppReducer from './reducers';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AppReducer>
      <AppRouter />
    </AppReducer>
  </React.StrictMode>
);