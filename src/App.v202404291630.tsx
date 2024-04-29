import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import Router from './routes';
function App() {
  return (
    <BrowserRouter>
      <main className='wrapper'>
          <Router />
      </main>
    </BrowserRouter>
  );
}

export default App;
