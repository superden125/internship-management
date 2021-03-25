import { Router } from "express";

const router = Router();
/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("home", { title: "Internship Management System" });
});

module.exports = router;
