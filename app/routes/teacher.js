import express from 'express';

import * as teacherController from '../controller/teacher.controller';

import auth from '../middleware/auth';

const router = express.Router();

router.get('/', auth.isTeacher, teacherController.index);

module.exports = router;
