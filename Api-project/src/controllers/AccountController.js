class AccountController {
  index(req, res, next) {
    res.render('accountView/Index');
  }
}

module.exports = new AccountController();
