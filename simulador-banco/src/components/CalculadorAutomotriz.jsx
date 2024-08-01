import React, { useState, useEffect } from 'react';
import './CalculadorAutomotriz.css';

function CalculadorAutomotriz() {
    const seguro = 4200;
    const tasaInteresAnual = .1499;
    const plazosDisponibles = [6, 12, 18, 24, 30, 36, 42];

    const [capital, setCapital] = useState('');
    const [enganche, setEnganche] = useState('');
    const [porcentajeEnganche, setPorcentajeEnganche] = useState(15);
    const [plazoEnMeses, setPlazoEnMeses] = useState(plazosDisponibles[6]);
    const [resultado, setResultado] = useState(null);
    const [error, setError] = useState('');
    const [showTip, setShowTip] = useState(false);

    const setCapitalOn = (e) => {
        const value = e.target.value.replace(/,/g, '');
        const revision = parseFloat(value);
        if (!isNaN(revision) && revision >= 0) {
            setCapital(revision);
            setEnganche((revision * porcentajeEnganche / 100).toFixed(2));
            setError('');
        } else {
            setCapital('');
            setEnganche('');
            setError('Por favor, ingrese un valor válido para el costo del auto.');
        }
    };

    const setEngancheOn = (e) => {
        const value = e.target.value.replace(/,/g, '');
        const revision = parseFloat(value);
        if (!isNaN(revision) && revision >= 0) {
            setEnganche(revision);
            if (capital) {
                const percentage = (revision / capital) * 100;
                setPorcentajeEnganche(percentage);
            }
            setError('');
        } else {
            setEnganche('');
            setError('Por favor, ingrese un valor válido para el enganche.');
        }
    };

    const handleSliderChange = (e) => {
        const percentage = parseFloat(e.target.value);
        setPorcentajeEnganche(percentage);
        if (capital) {
            setEnganche((capital * percentage / 100).toFixed(2));
        }
    };

    useEffect(() => {
        if (capital !== '' && enganche !== '' && tasaInteresAnual > 0 && plazoEnMeses > 0) {
            const montoPrestamo = calcularMontoPrincipal(capital, enganche, seguro);
            const pagoMensual = calcularPagoMensual(montoPrestamo, tasaInteresAnual, 12, plazoEnMeses / 12);
            if (montoPrestamo >= 0) {
                setResultado({
                    montoPrestamo,
                    pagoMensual
                });
            } else {
                setResultado(null);
                setError('El resultado no puede ser negativo. Verifique los valores ingresados.');
            }
        } else {
            setResultado(null);
        }
    }, [capital, enganche, tasaInteresAnual, plazoEnMeses]);

    const calcularMontoPrincipal = (capital, enganche, seguro) => {
        return (capital + seguro) - enganche;
    };

    const calcularPagoMensual = (P, r, n, t) => {
        const tasaMensual = r / n;
        const totalPagos = n * t;
        return (P * tasaMensual) / (1 - (1 + tasaMensual) ** -totalPagos);
    };

    const toggleTip = () => {
        setShowTip(!showTip);
    };

    return (
        <>
            <div className='wrapper'>
                <h1 className='titulo-contenedor'>Calculador de crédito automotriz</h1>
                <div className='input-container'>
                    <div className='capital-container'>
                        <label htmlFor='capital'>¿Cuánto cuesta el auto que deseas? </label>
                        <input 
                            placeholder='Ingresa un valor en pesos mexicanos (mxn)' 
                            id='capital' 
                            value={capital} 
                            onChange={setCapitalOn} 
                        />
                    </div>
                    <div className='enganche-container'>
                        <label htmlFor='enganche'>¿Cuánto vas a ofrecer de enganche? </label>
                        <input 
                            value={enganche} 
                            placeholder='Ingresa un valor en pesos mexicanos (mxn)' 
                            id='enganche' 
                            onChange={setEngancheOn} 
                        />
                        <div className='slider-container'>
                            <label htmlFor='porcentaje'>Porcentaje de enganche:</label>
                            <input 
                                type='range' 
                                id='porcentaje' 
                                min='15' 
                                max='100' 
                                step='1' 
                                value={porcentajeEnganche} 
                                onChange={handleSliderChange} 
                            />
                            <span>{porcentajeEnganche.toFixed(2)}%</span>
                        </div>
                    </div>
                    <div className='plazo-container'>
                        <label htmlFor='plazoEnMeses'>Plazo del préstamo:</label>
                        <select
                            id='plazoEnMeses'
                            value={plazoEnMeses}
                            onChange={(e) => setPlazoEnMeses(parseInt(e.target.value, 10))}
                        >
                            {plazosDisponibles.map((plazo) => (
                                <option key={plazo} value={plazo}>{plazo} meses</option>
                            ))}
                        </select>
                    </div>
                </div>
                {error && <div className="error-container">{error}</div>}
                <div className="prestamo-container">
                    <p>Incluye el seguro por $4,200.00</p>
                    <span className='ayuda' onClick={toggleTip} dangerouslySetInnerHTML={{ __html: icons.ayuda }} />
                    {showTip && <div className='tip'>Este préstamo incluye seguro de vida, más no incluye el seguro del automóvil que se desea adquirir. Eso debe ser consultado con su vendedor.</div>}
                    {resultado && (
                        <>
                            <h1>Préstamo que se te otorgará: {resultado.montoPrestamo !== null ? `$ ${resultado.montoPrestamo.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : ''}</h1>
                            <h1>Pago mensual: {resultado.pagoMensual !== null ? `$ ${resultado.pagoMensual.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : ''}</h1>
                        </>
                    )}
                    <h1>Interés fijo: {tasaInteresAnual * 100} %</h1>
                </div>
            </div>
        </>
    );
}

export default CalculadorAutomotriz;

const icons = {
    ayuda: `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#ffffff"><path d="M478-240q21 0 35.5-14.5T528-290q0-21-14.5-35.5T478-340q-21 0-35.5 14.5T428-290q0 21 14.5 35.5T478-240Zm-36-154h74q0-33 7.5-52t42.5-52q26-26 41-49.5t15-56.5q0-56-41-86t-97-30q-57 0-92.5 30T342-618l66 26q5-18 22.5-39t53.5-21q32 0 48 17.5t16 38.5q0 20-12 37.5T506-526q-44 39-54 59t-10 73Zm38 314q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-320Z"/></svg>`
};