import express from "express";

import * as dbController from '../controllers/db';

const router = express.Router();

router.get('/major', dbController.mockMajorDB);
router.get('/user', dbController.mockUserDB);
router.get('/internship-unit', dbController.mockInternshipUnitDB);
router.get('/milestone', dbController.mockMilestone)

module.exports = router;