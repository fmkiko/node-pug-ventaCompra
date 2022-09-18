import express from 'express';
import {home, formularioLogin, formularioRegistro, registrar, confirmar,
     formularioOlvidePassword} from '../controllers/userController.js'
const router = express.Router();

router.get('/', home);
router.get('/login', formularioLogin);
router.get('/registro', formularioRegistro);
router.post('/registro', registrar);
router.get('/confirmar/:token', confirmar);
router.get('/olvide-password', formularioOlvidePassword);

export default router;