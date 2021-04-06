import { Router } from "express";
import { login, testFn } from "../controllers/user";

const router = Router();
/* GET home page. */
router.get("/", async function (req, res, next) {
  if (!req.session.user) return res.redirect("/login");
  const user = req.session.user;
  if (user.role == 0) {
    return res.redirect("/student");
  }

  if (user.role == 3) {
    return res.redirect("/admin");
  }
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
  //res.send(req.session.user);
  res.redirect("/");
});

router.get("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/");
});

module.exports = router;
