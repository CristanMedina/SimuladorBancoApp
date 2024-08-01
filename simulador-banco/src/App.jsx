import React from 'react';
import CalculadorAutomotriz from './components/CalculadorAutomotriz';
import logo from '../public/logo.svg';
import './App.css';


const App = () => {
  

  return (
    <>
      <div className='logo'>
        <img src={logo} alt="Logo" width="200"/>
      </div>
      <div className='contenedor'>
        <CalculadorAutomotriz/>
      </div>
    </>
  );
};

export default App;

