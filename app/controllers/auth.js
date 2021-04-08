import { login, testFn } from './user';

// [GET] /
module.exports.index =  async (req, res) => {
  if (!req.session.user) return res.redirect('/login');

  const user = req.session.user;
  if (user.role == 0) {
    return res.redirect('/student');
  }

  if (user.role == 1) {
    return res.redirect('/teacher');
  }

  if (user.role == 3) {
    return res.redirect('/admin');
  }
  // res.redirect("/login");
}

module.exports.login = async (req, res) => {
  if (req.method === 'GET') return res.render('login'); // [GET] /login

  if (req.method === 'POST') { // [POST] /login
    const { username, password } = req.body;
    if (username === '') return res.json({ err: 'username empty' });
    if (password === '') return res.json({ err: 'password empty' });
    const user = await login(username, password);
    // console.log(user);
    if (user.err) return res.json(user.err);
    req.session.user = user;
    console.log(req.session.user);
    //res.send(req.session.user);
    res.redirect('/');
  }
}

module.exports.logout = (req, res) => {
  req.session.destroy();
  res.redirect('/');
}
