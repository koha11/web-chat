const ObjectId = require('mongoose').Types.ObjectId;

const User = require('../models/User');
const Chat = require('../models/Chat');

class UserService {
  async setStatus(userID, isOnline) {
    userID = new ObjectId(userID);

    const user = await User.findById(userID);

    user.isOnline = isOnline;
    user.save();
  }

  async getContactList(userID) {
    const userChatList = await Chat.find({ users: { $in: [userID] } }).populate(
      'users'
    );

    return userChatList.map((chat) => {
      const contact = chat.users.filter((user) => !user._id.equals(userID))[0];
      return {
        id: contact._id,
        chatID: chat._id,
        fullname: contact.fullname,
        username: contact.username,
        isOnline: contact.isOnline,
      };
    });
  }

  async getOnlineList(userID) {
    const contactList = await this.getContactList(userID);
    return contactList.filter((contact) => contact.isOnline);
  }
}

module.exports = new UserService();
