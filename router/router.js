import express from 'express';
import {home, formularioLogin, formularioRegistro, formularioOlvidePassword} from '../controllers/userController.js'
const router = express.Router();

router.get('/', home);
router.get('/login', formularioLogin);
router.get('/registro', formularioRegistro);
router.get('/olvide-password', formularioOlvidePassword);

export default router;