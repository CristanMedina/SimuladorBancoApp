import React, { useState, useEffect } from 'react';
import './CalculadorAutomotriz.css';

function CalculadorAutomotriz() {
    const seguro = 4200;
    const tasaInteresFija = 0.15;
    const plazosDisponibles = [6, 12, 18, 24, 30, 36, 42];

    const [capital, setCapital] = useState('');
    const [enganche, setEnganche] = useState('');
    const [porcentajeEnganche, setPorcentajeEnganche] = useState(15);
    const [plazoEnMeses, setPlazoEnMeses] = useState(plazosDisponibles[6]);
    const [resultado, setResultado] = useState(null);
    const [tablaPagos, setTablaPagos] = useState([]);
    const [error, setError] = useState('');
    const [showTip, setShowTip] = useState(false);
    const [totalCapitalPagado, setTotalCapitalPagado] = useState(0);
    const [totalInteresesPagados, setTotalInteresesPagados] = useState(0);
    const [totalPago, setTotalPago] = useState(0);

    const IVA = 0.16;

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
        if (capital !== '' && enganche !== '' && tasaInteresFija > 0 && plazoEnMeses > 0) {
            const montoPrestamo = calcularMontoPrincipal(capital, enganche, seguro);
            const pagoMensual = calcularPagoMensual(montoPrestamo, tasaInteresFija, plazoEnMeses);
            if (montoPrestamo >= 0) {
                setResultado({
                    montoPrestamo,
                    pagoMensual
                });
                generarTablaPagos(montoPrestamo, plazoEnMeses, pagoMensual);
            } else {
                setResultado(null);
                setError('El resultado no puede ser negativo. Verifique los valores ingresados.');
            }
        } else {
            setResultado(null);
            setTablaPagos([]);
            setTotalCapitalPagado(0);
            setTotalInteresesPagados(0);
            setTotalPago(0);
        }
    }, [capital, enganche, tasaInteresFija, plazoEnMeses]);

    const calcularMontoPrincipal = (capital, enganche, seguro) => {
        return (capital + seguro) - enganche;
    };

    const calcularPagoMensual = (montoPrestamo, tasaInteresFija, plazoEnMeses) => {
        const interesTotal = montoPrestamo * tasaInteresFija;
        return (montoPrestamo + interesTotal) / plazoEnMeses;
    };

    const generarTablaPagos = (montoPrestamo, plazoEnMeses, pagoMensual) => {
        let tabla = [];
        let totalCapitalPagado = 0;
        let totalInteresesPagados = 0;
        const interesFijo = montoPrestamo * tasaInteresFija;
        const pagoMensualInteres = interesFijo / plazoEnMeses;
        let capitalRestante = montoPrestamo;

        for (let i = 1; i <= plazoEnMeses; i++) {
            const pagoCapital = Math.min(capitalRestante, pagoMensual - pagoMensualInteres);
            
            tabla.push({
                mes: i,
                saldoInsoluto: capitalRestante.toFixed(2),
                pagoMensualCapital: pagoCapital.toFixed(2),
                primaSeguroVida: seguro.toFixed(2),
                pagoMensualInteresesAuto: pagoMensualInteres.toFixed(2),
            });

            capitalRestante -= pagoCapital;
            totalCapitalPagado += pagoCapital;
            totalInteresesPagados += pagoMensualInteres;

            if (capitalRestante <= 0) break;
        }

        // Agregar fila de resumen
        tabla.push({
            mes: 'Total',
            saldoInsoluto: '',
            pagoMensualCapital: totalCapitalPagado.toFixed(2),
            primaSeguroVida: (seguro * plazoEnMeses).toFixed(2),
            pagoMensualInteresesAuto: interesFijo.toFixed(2),
        });

        setTablaPagos(tabla);
        setTotalCapitalPagado(totalCapitalPagado);
        setTotalInteresesPagados(totalInteresesPagados);
        setTotalPago((totalCapitalPagado + interesFijo).toFixed(2));
    };

    const toggleTip = () => {
        setShowTip(!showTip);
    };

    return (
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
                <span className='ayuda' onClick={toggleTip}>❓</span>
                {showTip && <div className='tip'>Este préstamo incluye seguro de vida, más no incluye el seguro del automóvil que se desea adquirir. Eso debe ser consultado con su vendedor.</div>}
                {resultado && (
                    <>
                        <h1>Préstamo que se te otorgará: ${resultado.montoPrestamo.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h1>
                        <h1>Pago mensual: ${resultado.pagoMensual.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h1>
                    </>
                )}
            </div>
            {tablaPagos.length > 0 && (
                <div className='tabla-container'>
                    <h2>Tabla de Pagos</h2>
                    <table>
                        <thead>
                            <tr>
                                <th>Mes</th>
                                <th>Saldo Insoluto</th>
                                <th>Pago Capital</th>
                                <th>Prima Seguro Vida</th>
                                <th>Intereses</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tablaPagos.map((pago, index) => (
                                <tr key={index}>
                                    <td>{pago.mes}</td>
                                    <td>{pago.saldoInsoluto ? `$${pago.saldoInsoluto}` : '-'}</td>
                                    <td>{pago.pagoMensualCapital ? `$${pago.pagoMensualCapital}` : '-'}</td>
                                    <td>{pago.primaSeguroVida ? `$${pago.primaSeguroVida}` : '-'}</td>
                                    <td>{pago.pagoMensualInteresesAuto ? `$${pago.pagoMensualInteresesAuto}` : '-'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
            {totalPago > 0 && (
                <div className='resumen-total-container'>
                    <h2>Resumen del Pago Total</h2>
                    <p><strong>Total a Pagar:</strong> ${totalPago.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                </div>
            )}
        </div>
    );
}

export default CalculadorAutomotriz;

const icons = {
    ayuda: `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#ffffff"><path d="M478-240q21 0 35.5-14.5T528-290q0-21-14.5-35.5T478-340q-21 0-35.5 14.5T428-290q0 21 14.5 35.5T478-240Zm-36-154h74q0-33 7.5-52t42.5-52q26-26 41-49.5t15-56.5q0-56-41-86t-97-30q-57 0-92.5 30T342-618l66 26q5-18 22.5-39t53.5-21q32 0 48 17.5t16 38.5q0 20-12 37.5T506-526q-44 39-54 59t-10 73Zm38 314q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-320Z"/></svg>`
};
