export function calcularInteres( P, r, n, t )
{

   const tasaMensual = r / n;
   const totalPagos = n * t;

   const pagoMensual = (P * tasaMensual) / (1 - Math.pow(1 + tasaMensual, -totalPagos));

   return pagoMensual; 
}