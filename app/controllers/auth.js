import {
  login,
  testFn
} from './user';

// [GET] /
module.exports.index = async (req, res) => {
  if (!req.session.user) return res.redirect('/login');

  const user = req.session.user;
  if (user.role == 'student') {
    return res.redirect('/student');
  }

  if (user.role == 'teacher') {
    return res.redirect('/teacher');
  }

  if (user.role == 'admin') {
    return res.redirect('/admin');
  }
  // res.redirect("/login");
}

module.exports.login = async (req, res) => {
  if (req.method === 'GET') return res.render('login2', {
    err: null
  }); // [GET] /login

  if (req.method === 'POST') { // [POST] /login
    const {
      username,
      password
    } = req.body;

    if (username === '') return res.render('login2', {
      err: 'username empty'
    });

    if (password === '') return res.render('login2', {
      err: 'password empty'
    });

    const user = await login(username, password);
    // console.log(user);
    if (user.err) return res.render('login2', {
      username,
      err: user.err
    });

    req.session.user = user;
    console.log(req.session.user);
    res.redirect('/');
  }
}

module.exports.logout = (req, res) => {
  req.session.destroy();
  res.redirect('/');
}