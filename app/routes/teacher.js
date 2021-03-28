import express from "express";

import { isTeacher } from "../../middleware/auth";

const router = express.Router();

router.use(isTeacher);

router.get("/", (req, res) => {
  res.render("teacher/home", {
    title: "Internship Management System",
    roleName: "Sinh viên",
    urlInfo: "Thông tin thực tập",
  });
});

module.exports = router;
