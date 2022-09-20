import express from 'express';
import csurf from 'csurf';
import cookieParser from 'cookie-parser';
import userRouter from './router/router.js';
import propiedadesRouter from './router/propiedadesRouter.js';
import db from './config/db.js';

const app = express();
// Habilitar lectura POST, antigua mente se usa el bodyParse ahora no
app.use(express.urlencoded({extended: true}));
// Habilitar Cookie Parser
app.use(cookieParser());
// Habilitar CSRF
app.use(csurf({cookie: true}));

// Archivos estaticos
app.use(express.static('public'));

// set templace
app.set("view engine", "pug");
app.set("views", "./views");
// router
app.use('/auth',userRouter);
app.use('/', propiedadesRouter );

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