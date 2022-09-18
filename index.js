import express from 'express';
import userRouter from './router/router.js';
import db from './config/db.js';


const app = express();

// Archivos estaticos
app.use(express.static('public'));
// Habilitar lectura POST, antigua mente se usa el bodyParse ahora no
app.use(express.urlencoded({extended: true}));
// set templace
app.set("view engine", "pug");
app.set("views", "./views");
// router
app.use('/auth',userRouter);

// Conexion a la db
try{
    await db.authenticate();
    db.sync();
    console.log("Conexion ok");

}catch(error){
    console.log("Error de conexion en DB  " + error);
}


const port = process.env.PORT || 3000;
const url = process.env.URL || '127.0.0.1';
app.listen(port, url, ()=>{
    console.log(`Server running in ${url}:${port}`);
});