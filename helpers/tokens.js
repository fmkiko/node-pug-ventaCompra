import jwt from 'jsonwebtoken';
// Generando JWT del id del usuario
const generarJWT = ( datos )=>{
    return jwt.sign(
        {   id: datos.id,
            nombre: datos.nombre },
        process.env.JWT_SECRET
        ,
        { expiresIn: '1d'}
        )
}



// Generando un pequeño token, casero
const generarId = ()=> Date.now().toString(32) + Math.random().toString(32).substring(2);

export {
    generarJWT,
    generarId
}