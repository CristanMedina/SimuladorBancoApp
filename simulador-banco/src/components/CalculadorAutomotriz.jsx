import React, { useState, useEffect } from 'react';
import './CalculadorAutomotriz.css';

function CalculadorAutomotriz() {

  const TIF = 12.99;
  const seguro = 4200;

  const [capital, setCapital] = useState('');
  const [enganche, setEnganche] = useState('');
  const [resultado, setResultado] = useState(null);
  const [error, setError] = useState('');
  const [showTip, setShowTip] = useState(false);

  const setCapitalOn = (e) => {
    const value = e.target.value.replace(/,/g, '');
    const revision = parseFloat(value);
    if (!isNaN(revision) && revision >= 0) {
      setCapital(revision);
      setError('');
    } else {
      setCapital('');
      setError('Por favor, ingrese un valor válido para el costo del auto.');
    }
  };

  const setEngancheOn = (e) => {
    const value = e.target.value.replace(/,/g, '');
    const revision = parseFloat(value);
    if (!isNaN(revision) && revision >= 0) {
      setEnganche(revision);
      setError('');
    } else {
      setEnganche('');
      setError('Por favor, ingrese un valor válido para el enganche.');
    }
  };

  useEffect(() => {
    if (capital !== '' && enganche !== '') {
      const result = (capital + seguro) - enganche;
      if (result >= 0) {
        setResultado(result);
      } else {
        setResultado(null);
        setError('El resultado no puede ser negativo. Verifique los valores ingresados.');
      }
    } else {
      setResultado(null);
    }
  }, [capital, enganche]);

  const toggleTip = () => {
    setShowTip(!showTip);
  };

  return (
    <>
    <div className='wrapper'>
      <h1 className='titulo-contenedor'>Calculador Automotriz</h1>
      <div className='input-container'>
        <div className='capital-container'>
          <label htmlFor='capital'>Costo del Auto: </label>
          <span className='ayuda' onClick={toggleTip} dangerouslySetInnerHTML={{ __html: icons.ayuda }} />
          { showTip && <div className='tip-capital'>Ingresa el precio en pesos mexicanos.</div>}
          <input id='capital' onChange={setCapitalOn} />
        </div>
        <div className='enganche-container'>
          <label htmlFor='enganche'>Enganche: </label>
          <span className='ayuda' onClick={toggleTip} dangerouslySetInnerHTML={{ __html: icons.ayuda }} />
          { showTip && <div className='tip-capital'>Ingresa el dinero que daras de entrada. Ingresa el precio en pesos mexicanos</div>}
          <input id='enganche' onChange={setEngancheOn} />
        </div>
      </div>
      {error && <div className="error-container">{error}</div>}
      <div className="prestamo-container">
        <h1>Prestamo que se te otorgara: {resultado !== null ? `$ ${resultado.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : ''}</h1>
      </div>
    </div>
    </>
  );
}

export default CalculadorAutomotriz;

const icons = {
  ayuda: `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#ffffff"><path d="M478-240q21 0 35.5-14.5T528-290q0-21-14.5-35.5T478-340q-21 0-35.5 14.5T428-290q0 21 14.5 35.5T478-240Zm-36-154h74q0-33 7.5-52t42.5-52q26-26 41-49.5t15-56.5q0-56-41-86t-97-30q-57 0-92.5 30T342-618l66 26q5-18 22.5-39t53.5-21q32 0 48 17.5t16 38.5q0 20-12 37.5T506-526q-44 39-54 59t-10 73Zm38 314q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z"/></svg>`
}