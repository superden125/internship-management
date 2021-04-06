import { Router } from "express";

import * as authController from '../controllers/auth';


const router = Router();
/* GET home page. */
router.get('/', authController.index);

router.get('/login', authController.login);
router.post('/login', authController.login);

router.get('/logout', authController.logout);

module.exports = router;
