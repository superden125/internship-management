import express from "express";

import * as dbController from "../controller/db.controller";

const router = express.Router();

router.get("/major", dbController.mockMajorDB);
router.get("/teacher", dbController.mockTeacherDB);
router.get("/mock-milestone", dbController.mockMilestone);

module.exports = router;
