import jwt from 'jsonwebtoken';
import Usuario  from '../models/Usuario.js';

const protegerRuta = async (req, resp, next)=>{
    //console.log("Desde el middleware");
    // Extraer el token del cookie
    const {_token} = req.cookies;
    if(!_token){
        return resp.redirect('/auth/login');
    }
    // Comporbar el token
    try {
        const decoded = jwt.verify(_token, process.env.JWT_SECRET );
        console.log(decoded);
        const usuario = await Usuario.scope('eliminarPassword').findByPk( decoded.id );
        //console.log(usuario);
        // Almacenar el usuario en el req
        if(usuario){
            req.usuario  = usuario;
        }else{
            return resp.redirect('/auth/login');
        }
        return next();
    } catch (error) {
        return resp.clearCookie('_token').redirect('/auth/login')
    }

}

export default protegerRuta;