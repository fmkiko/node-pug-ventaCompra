import nodemailer from 'nodemailer';
const emailRegistro = async ( datos )=>{
    // Conexion mailtrap con nodemailer
    const transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
      });
    
    // Envio del email
    const { nombre, email, token } = datos;
  
    await transport.sendMail( {
        from: 'BienesRaices2022',
        to: email,
        subject: 'Confirmar la cuenta en BienesRaices.com',
        text: 'Confirmar la cuenta en BienesRaices.com',
        html: `
            <p> Hola ${nombre}  conprueba tu cuenta en BienesRaices </p>
            <p>Tu cuenta necesita ser confirmada, pulsa el siguiente enlace: 
            <a href="${ process.env.BACKEND_URL }:${ process.env.PORT ?? 3000}/auth/confirmar/${token}">COMFIRMAR CUENTA</a></p>
            <p>Si tu no creastes esta cuenta puedes ignorar el mensaje</p>
        `
    })
}

const emailOlvidePassword = async ( datos )=>{
    // Conexion mailtrap con nodemailer
    const transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
      });
    
    // Envio del email
    const { nombre, email, token } = datos;
  
    await transport.sendMail( {
        from: 'BienesRaices2022',
        to: email,
        subject: 'Reesteblece tu Password en BienesRaices.com',
        text: 'Reesteblece tu Password en BienesRaices.com',
        html: `
            <p> Hola ${nombre}, has solicitado reestablecer tu password en BienesRaices.com </p>
            <p>Sigue el siguiente enlace para generar un password nuevo: 
            <a href="${ process.env.BACKEND_URL }:${ process.env.PORT ?? 3000}/auth/olvide-password/${token}">Restablecer Password</a></p>
            <p>Si tu no solicitaste el cambio de password, puedes ignorar el mensaje.</p>
        `
    })
}

export{
    emailRegistro,
    emailOlvidePassword
}