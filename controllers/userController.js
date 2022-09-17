import {check, validationResult} from 'express-validator';
import Usuario from '../models/Usuario.js';
import  { generarId } from '../helpers/tokens.js';

const home = (req,resp)=>{
    resp.send("Hola desde el router");
};
const formularioLogin = (req,resp)=>{
    resp.render("auth/login", { pagina : "Iniciar Sesión" } );
}
const formularioRegistro = (req, resp)=>{
  
    resp.render("auth/registro", { pagina : "Crear Cuenta" } );
}
const registrar = async (req, resp)=>{
  
    const { nombre, email, password } = req.body;
    // Validar los campos
    await check('nombre').notEmpty().withMessage("El nombre es obligatorio!!!").run(req);
    await check('email').isEmail().withMessage("El email no es valido!!!").run(req);
    await check('password').isLength({min: 6}).withMessage("Minimo 6 caracteres").run(req);
   // const {password} = req.body;
    await check('repetir_password').equals(password).withMessage("Los passwords tiene que ser iguales").run(req);
   
    let resultado = validationResult(req);
 
   if (!resultado.isEmpty()){
        // errores
        return resp.render('auth/registro', {
            pagina: 'Crear Cuenta',
            errores: resultado.array(),
            usuario: {
                nombre: nombre,
                email: email
            }
        } )
   }
   // Verificar que el usuario no existe ya
   const existeUsuario = await Usuario.findOne({ where : { email }}); 
   if (existeUsuario) {
        return resp.render('auth/registro', { 
            pagina: 'Crear Cuenta',
            errores: [{msg: "El Ususario ya esta resgistrado..."}],
            usuario: {
                nombre: nombre,
                email: email
            }
        })
   }
   // Almacenar datos
   await Usuario.create({
    nombre,
    email,
    password,
    token: generarId()
   }); 
   
   resp.render('auth/registro', { pagina: 'Crear Cuenta'});
 
}
const formularioOlvidePassword = (req, resp)=>{
    resp.render("auth/olvide-password", { pagina : "Recuperar Password" } );
}
export {
    home,
    formularioLogin,
    formularioRegistro,
    registrar,
    formularioOlvidePassword
}