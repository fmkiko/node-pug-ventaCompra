import {check, validationResult} from 'express-validator';
import Usuario from '../models/Usuario.js';
import  { generarId } from '../helpers/tokens.js';
import { emailRegistro } from '../helpers/emails.js';

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
   const user = await Usuario.create({
    nombre,
    email,
    password,
    token: generarId()
   }); 
   // Enviar email
   emailRegistro({ 
        nombre: user.nombre,
        email: user.email,
        token: user.token
    });
   
   resp.render('templace/mensaje', { 
    pagina: 'Cuenta Creada Correctamente.',
    mensaje: 'Hemos Enviado un Email de Confirmación, presiona en el enlace que encontrara en el email.'
});
 
}
const confirmar = async (req, resp)=>{
    // Comfirmar la cuenta
    // vemos si el emailexite
    const { token } = req.params;
    //console.log(token);
    // Verificar si el toke es valido y confirmamos cuenta
    const usuario = await Usuario.findOne({
        where: { token }
    });
    if (!usuario){
        return resp.render('auth/confirmar-cuenta',{
            pagina: 'ERROR al confirmar la cuenta.',
            mensaje: 'Hubo un error al confirmar tu cuenta, intenta de nuevo pasados unos minutos...',
            error: true
        })
    }
    // Validar y quitar token
    usuario.token = null;
    usuario.confirmado = true;
    await usuario.save(); // desta forma volvemos se actualiza los datos
    // Cuenta no confirmada correctamente
    resp.render('auth/confirmar-cuenta',{
        pagina: 'Cuenta Confirmación',
        mensaje: 'Gracias, su cuenta ha sido confirmada correctament'
    })


}
const formularioOlvidePassword = (req, resp)=>{
    resp.render("auth/olvide-password", { pagina : "Recuperar Password" } );
}
export {
    home,
    formularioLogin,
    formularioRegistro,
    registrar,
    confirmar,
    formularioOlvidePassword
}