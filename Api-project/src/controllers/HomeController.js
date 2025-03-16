/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 */

const User = require('../models/User');

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

class HomeController {
  // GET METHODS
  index(req, res, next) {
    res.render('homeView/index');
  }

  login(req, res, next) {
    res.render('homeView/login');
  }

  register(req, res, next) {
    res.render('homeView/register');
  }

  // POST METHODS
  signin(req, res, next) {
    const { username, password } = req.body;
    User.findOne({ username: username }).then((user) => {
      if (!user)
        return res
          .status(400)
          .json({ status: 0, message: 'Tài khoản không tồn tại' });
      const isMatch = bcrypt.compareSync(password, user.password);

      if (!isMatch)
        return res
          .status(400)
          .json({ status: 1, message: 'Mật khẩu không hợp lệ' });

      // Tạo JWT token
      const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
        algorithm: 'HS256',
        allowInsecureKeySizes: true,
        expiresIn: process.env.JWT_EXPIRATION,
      });

      res.cookie('access_token', token).status(200).json({
        status: 2,
        access_token: token,
        expiresIn: process.env.JWT_EXPIRATION,
      });
    });
  }

  signup(req, res, next) {
    const userData = req.body; // get form-data
    bcrypt
      .hash(userData.password, 10)
      .then((hashedPwd) => {
        userData.password = hashedPwd;
        const user = new User(userData);
        user.save().then(() => res.redirect('/login'));
      })
      .catch((err) => {
        console.log(err);
        process.exit();
      });
  }

  logout(req, res, next) {
    res.clearCookie('access_token').status(200).redirect('/login');
  }
}

module.exports = new HomeController();
