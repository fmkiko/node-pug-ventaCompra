import {check, validationResult} from 'express-validator';
import bcrypt from 'bcrypt';

import Usuario from '../models/Usuario.js';
import  { generarId, generarJWT } from '../helpers/tokens.js';
import { emailRegistro, emailOlvidePassword } from '../helpers/emails.js';

const home = (req,resp)=>{
    resp.send("Hola desde el router");
};
const formularioLogin = (req,resp)=>{
    resp.render("auth/login", { 
        pagina : "Iniciar Sesión",
        csrfToken: req.csrfToken(),
         
     } );
}
const autenticar = async (req, resp)=>{
    // Validar campos
    const { email, password } = req.body
    await check('email').isEmail().withMessage("El email es obligatori").run(req);
    await check('password').notEmpty().withMessage("El passwor es obligatorio").run(req);
    let resultado = validationResult(req);
    if (!resultado.isEmpty()){
        return  resp.render('auth/login', {
                pagina : "Iniciar Sesión",
                csrfToken: req.csrfToken(),
                errores: resultado.array(),
                usuario: { email }
        })
    }
    // Verificar usuario
    const usuario = await Usuario.findOne({ where: { email }});
    if(!usuario){
        return  resp.render('auth/login', {
                pagina : "Iniciar Sesión",
                csrfToken: req.csrfToken(),
                errores: [{msg: "El usuario no esta regitrado"}],
                usuario: { email }
        })
    }
    // Comprobar si el usuario esta comfirmado
    if(!usuario.confirmado){
        return  resp.render('auth/login', {
                pagina : "Iniciar Sesión",
                csrfToken: req.csrfToken(),
                errores: [{ msg: "Tu cuenta no ha sido confirmada" }],
                usuario: { email }
        })
    }
    // Revisar el password
    if(!usuario.verificarPassword( password )){
        return  resp.render('auth/login', {
                pagina : "Iniciar Sesión",
                csrfToken: req.csrfToken(),
                errores: [{ msg: "El Password no coincide" }],
                usuario: { email }
    })
    }
    // Autenticar al usuario con JWT
    const token = generarJWT( { id: usuario.id, nombre: usuario.nombre } );

    // Almacenar en cookie
    return resp.cookie('_token', token, {
        httpOnly: true, 
        // secure: true, 
    }).redirect('/mis-propiedades')
   
}
const formularioRegistro = (req, resp)=>{
    //console.log(req.csrfToken())
  
    resp.render("auth/registro", { 
        pagina : "Crear Cuenta",
        csrfToken: req.csrfToken()
    });
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
            csrfToken: req.csrfToken(),
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
            csrfToken: req.csrfToken(),
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
   
   resp.render('templates/mensaje', { 
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
    resp.render("auth/olvide-password", { 
        pagina : "Recuperar Password",
        csrfToken: req.csrfToken()

     } );
}
const resetPassword = async ( req, resp)=>{
    await check('email').isEmail().withMessage("El email debe ser correcto").run(req);
    let resultado = validationResult(req);
    if(!resultado.isEmpty()){
        // Error
        return resp.render('auth/olvide-password', {
            pagina : "Recuperar Password",
            csrfToken: req.csrfToken(),
            errores: resultado.array(),
            
        })
    }
    // Verificar que exite el email
    const email = req.body.email;
    const usuario = await Usuario.findOne( { where: { email: email } } );
   
    if (!usuario){

        return resp.render('auth/olvide-password', {
            pagina : "Recuperar Password",
            csrfToken: req.csrfToken(),
            errores: [ { msg:`El email: ${email} no se encuentra registrado.` } ],
            email: email
        })
    }
    // Generar token y guardar en DB
    usuario.token = generarId();
    await  usuario.save();
    // Enviar email
    emailOlvidePassword({
        email: usuario.email,
        nombre: usuario.nombre,
        token: usuario.token
    });
    // Renderizar mensaje
    resp.render('templates/mensaje', {
        pagina: 'Reestablece tu Password',
        mensaje: 'Hemos enviado un email con las instruciones'
    })
    
}

const comprobarToken = async (req, resp)=>{
    const token = req.params.token;
   
    const usuario = await Usuario.findOne({where: { token }});
    if (!usuario){
        return resp.render('auth/confirmar-cuenta', {
            pagina : "Error al validar petición",
            mensaje: 'Hubo un error al validar tu peticón, intenta de nuevo',
            error: true
            
        })
    }
    // Mostrar formulario para el nuevo password
    resp.render('auth/reset-password', {
        pagina: "Reestablece Tu Password",
        csrfToken: req.csrfToken(),

    } );
    
}

const nuevoPassword = async (req, resp)=>{
    
    // Validar el Password
    await check('password').isLength({min: 6}).withMessage("Mínimo 6 caracteres").run(req);
    const resultado = validationResult(req);
    if(!resultado.isEmpty()){
        return resp.render('auth/reset-password',{
            pagina: "Reestablece Tu Password",
            csrfToken: req.csrfToken(),
            errores: resultado.array()
        })
    }
    // Comprobar el token
    const { token } = req.params;
    const usuario = await Usuario.findOne({ where: { token }});
    if(!usuario){
        return resp.render('auth/reset-password',{
            pagina: "Reestablece Tu Password",
            csrfToken: req.csrfToken(),
            errores: [{msg: 'Error de validación, no se puede validar el cambio de password...'}]
        })             
    }
    // Cambio de password
    
    // Generamos un salt de 10
    const salt = await bcrypt.genSalt(10);
    // hacemos el has:
    usuario.password = await bcrypt.hash( req.body.password, salt);
    usuario.token = null;
    await usuario.save();
    
    resp.render('auth/confirmar-cuenta', {
        pagina: 'Password Guardado',
        mensaje: 'El Password se guardo correctamente'
    });
}
export {
    home,
    formularioLogin,
    autenticar,
    formularioRegistro,
    registrar,
    confirmar,
    formularioOlvidePassword, 
    resetPassword,
    comprobarToken,
    nuevoPassword
}