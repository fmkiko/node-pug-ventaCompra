// Generando un pequeño token, casero
const generarId = ()=> Date.now().toString(32) + Math.random().toString(32).substring(2);

export {
    generarId
}