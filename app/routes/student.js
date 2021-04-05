import express from "express";
import tinh from "../lib/tinh";

import {
  getAllInternshipUnit,
  getOneInternshipUnit,
} from "../controller/internshipUnit";
import { isStudent } from "../middleware/auth";
import * as studentController from "../controller/student";
import * as internInfoController from "../controller/internshipInfo";
const router = express.Router();

router.use(isStudent);

router.get("/", internInfoController.getInternshipInfo);

router
  .get("/register-internship", studentController.registerInternshipGet)
  .post("/register-internship", studentController.registerInternshipPost);

router.get("/internship-unit", studentController.getListInternshipUnit);

router.get("/internship-unit/:id", studentController.getInternshipUnitById);

module.exports = router;
