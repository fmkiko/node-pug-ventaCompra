const home = (req,resp)=>{
    resp.send("Hola desde el router");
};
const formularioLogin = (req,resp)=>{
    resp.render("auth/login", { pagina : "Iniciar Sesión" } );
}
const formularioRegistro = (req, resp)=>{
    resp.render("auth/registro", { pagina : "Crear Cuenta" } );
}
const formularioOlvidePassword = (req, resp)=>{
    resp.render("auth/olvide-password", { pagina : "Recuperar Password" } );
}
export {
    home,
    formularioLogin,
    formularioRegistro,
    formularioOlvidePassword
}