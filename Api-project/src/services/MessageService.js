const ObjectId = require('mongoose').Types.ObjectId;

const User = require('../models/User');
const Message = require('../models/Message');
const Chat = require('../models/Chat');

class MessageService {
  getMessages(userID, chatID) {
    userID = new ObjectId(userID);

    return (
      Chat.findById(chatID)
        // .populate({
        //   path: 'messages',
        //   populate: {
        //     path: 'user', // Lấy thông tin User từ Post
        //   },
        // })
        .populate('messages')
        .populate('users')
        .then((chat) => {
          const receiver = chat.users.filter((id) => !id.equals(userID))[0];
          const sender = chat.users.filter((id) => id.equals(userID))[0];

          const data = {
            sender: {
              id: userID,
              avatar: '',
              fullname: sender.fullname,
              isOnline: sender.isOnline,
            },
            receiver: {
              id: receiver.id,
              avatar: '',
              fullname: receiver.fullname,
              isOnline: receiver.isOnline,
            },
            msgList: [],
          };

          const msgList = chat.messages.map((msg) => {
            return {
              id: msg.id,
              user: msg.user,
              status: msg.status,
              time: msg.createdAt,
              body: msg.msgBody,
            };
          });

          data.msgList = msgList;

          return data;
        })
    );
  }

  getChatlist(userID) {
    // Get Current User
    userID = new ObjectId(userID);

    return Chat.find({
      users: userID,
      deleted: false,
    }).then((chatlist) => {
      return chatlist.map((chat) => chat.id);
    });
  }

  saveMessage(userID, chatID, msgBody) {
    // Get Current User
    userID = new ObjectId(userID);

    // Get chatID from form-data
    chatID = new ObjectId(chatID);

    // Handle save message on db
    const message = new Message({
      user: userID,
      msgBody,
    });

    return message.save().then((msg) => {
      return Chat.findById(chatID).then((chat) => {
        chat.messages.push(msg.id);
        return chat
          .save()
          .then((chat) => {
            return {
              id: msg.id,
              body: msg.msgBody,
              status: msg.status,
              time: msg.createdAt,
              user: msg.user,
            };
          })
          .catch((err) => {
            return {
              status: 0,
            };
          });
      });
    });
  }
}

module.exports = new MessageService();
