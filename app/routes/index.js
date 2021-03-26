import { Router } from "express";

const router = Router();
/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("student/home", {
    title: "Internship Management System",
    roleName: 'Sinh viên',
    urlInfo: 'Thông tin thực tập'
  });
});

module.exports = router;
