import express from 'express';

import { isAdmin } from '../middleware/auth';

import * as adminController from '../controllers/admin.controller';

const router = express.Router();

router.use(isAdmin);

router.get('/manage/teachers', adminController.getAllTeachers);
router.get('/manage/students', adminController.getAllStudents);

router.get('/', adminController.index);

module.exports = router;
