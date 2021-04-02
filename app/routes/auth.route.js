import { Router } from "express";
import { login, testFn } from "../controllers/user.controller";
import * as authController from '../controllers/auth.controller';
import User from "../models/user";
import bcryptjs from "bcryptjs";

const router = Router();
/* GET home page. */
router.get('/', authController.index);

router.get('/login', authController.login);
router.post('/login', authController.login);

module.exports = router;
