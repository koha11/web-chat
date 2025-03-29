const UserService = require('../services/UserService');

class ContactController {
  getContactList(req, res, next) {
    const userID = res.locals._user.id;
    UserService.getContactList(userID).then((data) => res.json(data));
  }

  getOnlineList(req, res, next) {
    const userID = res.locals._user.id;
    UserService.getOnlineList(userID).then((data) => res.json(data));
  }
}

module.exports = new ContactController();
