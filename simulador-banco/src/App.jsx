import React, { useState } from 'react';
import CalculadorAutomotriz from './components/CalculadorAutomotriz';
import CalculadorEstudiantil from './components/CalculadorEstudiantil';
import CalculadorHipotecario from './components/CalculadorHipotecario';
import './App.css';


const App = () => {
  const [selectedLoan, setSelectedLoan] = useState(null);

  return (
    <div className='hero'>
      <h1>Calculadora de Préstamos</h1>
      <div>
        <button onClick={() => setSelectedLoan('Automotriz')}>
          Préstamo Automotriz
        </button>
        <button onClick={() => setSelectedLoan('Hipotecario')}>
          Préstamo Hipotecario
        </button>
        <button onClick={() => setSelectedLoan('Estudiantil')}>
          Préstamo Estudiantil
        </button>
      </div>
      <div>
        {selectedLoan === 'Hipotecario' && <CalculadorHipotecario />}
        {selectedLoan === 'Automotriz' && <CalculadorAutomotriz />}
        {selectedLoan === 'Estudiantil' && <CalculadorEstudiantil />}
      </div>
    </div>
  );
};

export default App;

