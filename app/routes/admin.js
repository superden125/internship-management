import express from "express";
import InternshipUnit from "../models/internshipUnit";

import { isAdmin } from "../middleware/auth";

const router = express.Router();

//router.use(isAdmin);

router.get("/", (req, res) => {
  res.render("admin/index", {
    title: "Internship Management System",
    roleName: "Sinh viên",
    urlInfo: "Thông tin thực tập",
  });
});

//router.get("/mockInternUnit", );

router.get("/internship-unit", async (req, res) => {
  const data = await InternshipUnit.find({ mentor: { name: "Lê Bằng Thanh" } });
  res.json(data);
});

module.exports = router;
