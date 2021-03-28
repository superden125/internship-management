import { Router } from "express";
import { login, testFn } from "../../controller/user";
import User from "../models/user";
import bcryptjs from "bcryptjs";

const router = Router();
/* GET home page. */
router.get("/", function (req, res, next) {
  const role = req.session.user ? req.session.user.role : -1;

  if (role == 0) {
    return res.redirect("/student");
  }
  if (role == 1) {
    return res.redirect("/teacher");
  }
  if (role == 3) {
    return res.redirect("/admin");
  }
  res.redirect("/login");
});

router.get("/login", (req, res) => {
  res.render("login");
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  if (username === "") return res.json({ err: "username empty" });
  if (password === "") return res.json({ err: "password empty" });

  const user = await login(username, password);
  if (user.err) return res.json(user.err);
  req.session.user = user;
  res.redirect("/");
});

module.exports = router;
