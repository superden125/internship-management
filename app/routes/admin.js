import express from "express";

import { isAdmin } from "../middleware/auth";

const router = express.Router();

router.use(isAdmin);

router.get("/", (req, res) => {
  res.render("student/home", {
    title: "Internship Management System",
    roleName: "Sinh viên",
    urlInfo: "Thông tin thực tập",
  });
});

module.exports = router;
