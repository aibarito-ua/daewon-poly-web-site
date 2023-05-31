import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import Router from './routes';
import {Nav} from './components/layoutComponents/Nav';
import NavAside from './components/layoutComponents/Navs/NavAside';
function App() {
  return (
    <BrowserRouter>
      <Nav />
      <NavAside />
      <main className={`bg-gray-200 min-h-screen -mt-[10vh]`}>
        <Router />
      </main>
    </BrowserRouter>
  );
}

export default App;
