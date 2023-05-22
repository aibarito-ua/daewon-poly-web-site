import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import Router from './routes';
import Nav from './components/layoutComponents/Nav';
import Header from './components/layoutComponents/Header';
import Footer from './components/layoutComponents/Footer';
function App() {

  return (
    <BrowserRouter>
      {/* Header 안에 Nav Menu */}
      <Header />
      <main className='bg-gray-200 min-h-screen'>
        <Router />
      </main>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
