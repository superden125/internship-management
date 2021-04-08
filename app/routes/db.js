import express from "express";

import * as dbController from '../controllers/db';

const router = express.Router();

router.get('/major', dbController.mockMajorDB);
router.get('/student', dbController.mockStudentDB);
router.get('/teacher', dbController.mockTeacherDB);
router.get('/intership-unit', dbController.mockIntershipUnitDB);
router.get("/mock-milestone", dbController.mockMilestone);

module.exports = router;
