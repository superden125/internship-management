module.exports = {
  isStudent: (req, res, next) => {
    if (req.session.user && req.session.user.role == 'student') {
      next();
    } else {
      res.redirect("/");
    }
  },
  isTeacher: (req, res, next) => {
    if (req.session.user && req.session.user.role == 'teacher') {
      next();
    } else {
      res.redirect("/");
    }
  },
  isAdmin: (req, res, next) => {
    if (req.session.user && req.session.user.role == 'admin') {
      next();
    } else {
      res.redirect("/");
    }
  },
  setLocals: (req, res, next) => {
    if (req.session.user) {
      res.locals.userName = req.session.user.name;
      next();
    } else {
      res.redirect('/');
    }
  }
};