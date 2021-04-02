module.exports = {
  isStudent: (req, res, next) => {
    if (req.session.user && req.session.user.role == 0) {
      next();
    } else {
      res.redirect("/");
    }
  },
  isTeacher: (req, res, next) => {
    if (req.session.user && req.session.user.role == 1) {
      next();
    } else {
      res.redirect("/");
    }
  },
  isAdmin: (req, res, next) => {
    if (req.session.user && req.session.user.role == 3) {
      next();
    } else {
      res.redirect("/");
    }
  },
};
