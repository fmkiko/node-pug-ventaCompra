import express from 'express';
import userRouter from './router/router.js';
const port = 3000;
const app = express();
// set templace
app.set("view engine", "pug");
app.set("views", "./views");
// Archivos estaticos
app.use(express.static('public'));
// router
app.use(userRouter);

app.listen(port, "127.0.0.1", ()=>{
    console.log(`Server running in 127.0.0.1:${port}`);
});