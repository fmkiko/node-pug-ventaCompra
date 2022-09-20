import express from 'express';
import { admin } from '../controllers/propiedadesController.js';
import protegerRuta from '../middleware/protegerRuta.js'; 
const router = express.Router();

router.get('/mis-propiedades', protegerRuta, admin );


export default router;