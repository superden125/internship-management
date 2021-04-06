import express from "express";
import bcrypt from "bcryptjs";
import tinh from "../lib/tinh";
import Student from "../models/student";
import Major from "../models/major";
import User from "../models/user";
import {
  getAllInternshipUnit,
  getOneInternshipUnit,
} from "../controllers/internshipUnit";
import { isStudent } from "../middleware/auth";
import { registerInternship } from "../controllers/student";
import { getInternshipInfo } from "../controllers/internshipInfo";
const router = express.Router();



router.use(isStudent);

router.get("/", async (req, res) => {
  let data = {
    title: "Internship Management System",
    roleName: "Sinh viên",
    urlInfo: "Thông tin thực tập",
  };
  const internshipInfo = await getInternshipInfo(req.session.userId);
  if (!internshipInfo.err) {
    data = Object.assign(data, internshipInfo);
    data.error = {
      err: false,
    };
  } else {
    data.error = {
      err: true,
      msg: "Không tìm thấy thông tin đăng ký thực tập",
    };
  }

  res.render("student/home", data);
});

router.get("/register-internship", async (req, res) => {
  let data = {
    title: "Internship Management System",
    roleName: "Sinh viên",
    urlInfo: "Đăng ký thực tập",
  };

  const internshipUnit = await getAllInternshipUnit({ introBy: "admin" });
  data.internshipUnit = internshipUnit;
  data.tinh = tinh.sort((a, b) => a.name - b.name);
  res.render("student/register-internship", data);
});

router.post("/register-internship", async (req, res) => {
  //console.log(req.body);
  const data = req.body;
  data.idSv = req.session.userId;
  const result = await registerInternship(data);
  if (result.err) return res.send(result.err);
  res.send(result);
});

router.get("/internship-unit", async (req, res) => {
  let data = {
    title: "Internship Management System",
    roleName: "Sinh viên",
    urlInfo: "Danh sách đơn vị thực tập",
  };
  const internUnits = await getAllInternshipUnit({ introBy: "admin" });
  internUnits.forEach((internUnit) => {
    internUnit.city = tinh.find((tinh) => tinh.id == internUnit.city).name;
  });
  data.internUnits = internUnits;
  res.render("student/internship-unit", data);
});

router.get("/internship-unit/:id", async (req, res) => {
  let data = {
    title: "Internship Management System",
    roleName: "Sinh viên",
    urlInfo: "Danh sách đơn vị thực tập",
  };
  const internUnit = await getOneInternshipUnit({ _id: req.params.id });
  internUnit.city = tinh.find((tinh) => tinh.id == internUnit.city).name;
  data.internUnit = internUnit;

  res.render("student/internship-unit-id", data);
});

module.exports = router;
