import express from 'express';

import * as dbController from '../controllers/db.controller';

const router = express.Router();

router.get('/major', dbController.mockMajorDB);
router.get('/teacher', dbController.mockTeacherDB);

module.exports = router;
