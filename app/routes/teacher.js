import express from 'express';

import * as teacherController from '../controllers/teacher';

import auth from '../middleware/auth';

const router = express.Router();

router.get('/', auth.isTeacher, teacherController.index);

module.exports = router;
