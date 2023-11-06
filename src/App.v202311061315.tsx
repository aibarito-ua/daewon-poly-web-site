import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import Router from './routes';
import {Nav} from './components/layoutComponents/Nav';
import NavAside from './components/layoutComponents/Navs/NavAside';
function App() {
  return (
    <BrowserRouter>
      <main className='wrapper'>
        {/* <div className='container-wrapper relative'>
          <Nav />
          <NavAside /> */}
          <Router />
        {/* </div> */}
      </main>
    </BrowserRouter>
  );
}

export default App;
