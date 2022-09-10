import express from 'express';
import {home, login, registro} from '../controllers/userController.js'
const router = express.Router();

router.get('/', home);
router.get('/login', login);
router.get('/registro',registro);

export default router;