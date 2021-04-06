import express from "express";

import * as dbController from '../controllers/db';

const router = express.Router();

router.get('/major', dbController.mockMajorDB);
router.get('/student', dbController.mockStudentDB);
router.get('/teacher', dbController.mockTeacherDB);
router.get('/internship-unit', dbController.mockInternshipUnitDB);

module.exports = router;
