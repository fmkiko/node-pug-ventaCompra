const home = (req,resp)=>{
    resp.send("Hola desde el router");
};
const login = (req,resp)=>{
    resp.render("auth/login");
}
const registro = (req, resp)=>{
    resp.render("auth/registro");
}

export {
    home,
    login,
    registro
}