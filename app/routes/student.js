import express from "express";
import bcrypt from "bcryptjs";
import tinh from "../../lib/tinh";
import Student from "../models/student";
import Major from "../models/major";
import User from "../models/user";
import { getAllInternshipUnit } from "../../controller/internshipUnit";
import { isStudent } from "../../middleware/auth";
import { registerInternship } from "../../controller/student";

const router = express.Router();

const pwd = "ims123";

//router.use(isStudent);

router.get("/", (req, res) => {
  res.render("student/home", {
    title: "Internship Management System",
    roleName: "Sinh viên",
    urlInfo: "Thông tin thực tập",
  });
});

router.get("/mock", async (req, res) => {
  const major = await Major.findOne({ name: "KTPM" });
  console.log(major);
  const listStudent = [
    {
      mssv: "B1704835",
      name: "Trieu Duc Minh",
      idClass: "DI1796A2",
      idMajor: major._id,
      email: "minhb1704835@student.ctu.edu.vn",
    },
    {
      mssv: "B1234242",
      name: "Nguyen Thanh Nam",
      idClass: "DI1796A2",
      idMajor: major._id,
      email: "namb123454@student.ctu.edu.vn",
    },
    {
      mssv: "B1794932",
      name: "Le Van Lay",
      idClass: "DI1796A2",
      idMajor: major._id,
      email: "dayb1794932@student.ctu.edu.vn",
    },
    {
      mssv: "B1703947",
      name: "Nguyen Thi Dien",
      idClass: "DI1796A1",
      idMajor: major._id,
      email: "dienb1703947@student.ctu.edu.vn",
    },
    {
      mssv: "B1709485",
      name: "Do Cong Hua",
      idClass: "DI1796A1",
      idMajor: major._id,
      email: "huab1709485@student.ctu.edu.vn",
    },
  ];
  let count = 0;
  // listStudent.forEach(async (item) => {
  //   const student = new Student(item);
  //   const result = await student.save();
  //   const salt = await bcrypt.genSalt(10);
  //   const hashPass = await bcrypt.hash(pwd, salt);

  //   const user = new User({
  //     username: item.mssv,
  //     password: hashPass,
  //     ids: result._id,
  //     role: 0,
  //   });

  //   await user.save();
  // });
  res.send("done");
});

// router.get("/mockdb", async (req, res) => {
//   const major = new Major({ name: "KTPM" });
//   await major.save();
//   res.send("ok");
// });

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
  const result = await registerInternship(req.body);
  if (result.err) return res.send(result.err);
  res.send(result);
});

module.exports = router;
