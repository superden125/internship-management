import express from "express";

import { isStudent } from "../middleware/auth";
import * as studentController from "../controllers/student";
import * as internInfoController from "../controllers/internshipInfo";
const router = express.Router();

router.use(isStudent);

router.get("/", internInfoController.getInternshipInfo);

router
  .get("/register-internship", studentController.registerInternshipGet)
  .post("/register-internship", studentController.registerInternshipPost);

router.get("/internship-unit", studentController.getListInternshipUnit);

router.get("/internship-unit/:id", studentController.getInternshipUnitById);

module.exports = router;
