
const admin = (req,resp)=>{
    resp.render('propiedades/admin',{
        pagina: 'Mis Propiedades',
        barra: true
    });
}

export {
    admin
}