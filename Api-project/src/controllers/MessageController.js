const ObjectId = require('mongoose').Types.ObjectId;

const User = require('../models/User');
const Message = require('../models/Message');
const Chat = require('../models/Chat');

class MessageController {
  // GET METHODS

  index(req, res, next) {
    res.render('messageView/index');
  }

  chatDetails(req, res, next) {
    res.render('messageView/chatDetails');
  }

  getChatlist(req, res, next) {
    // Get Current User
    const userID = new ObjectId(res.locals._user.id);
    const user = User.findById(userID);

    Chat.find({
      users: userID,
      deleted: false,
    })
      .populate('users')
      .populate('messages')
      .then((data) => {
        const chatlist = data.map((chat) => {
          const contactUser = chat.users.filter(
            (user) => !user._id.equals(userID)
          )[0];

          return {
            id: chat._id,
            user: {
              fullname: contactUser.fullname,
              isOnline: contactUser.isOnline,
              avatar: '/assets/images/test.jpg',
            },
            lastMessage: {
              content: 'Hello brother !!!!',
              time: '13:30:00 28/02/2025',
            },
          };
        });

        res.json(chatlist);
      });
  }

  getMessages(req, res, next) {
    // Get Current User
    const userID = new ObjectId(res.locals._user.id);
    const chatID = req.params.id;

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

        res.json(data);
      });
  }

  // POST METHODS

  createChat(req, res, next) {
    // Get Current User
    const userID = new ObjectId(res.locals._user.id);
    const user = User.findById(userID);

    // Get form-data
    const receiverID = new ObjectId(req.body.receiverID);

    const chat = new Chat({
      users: [userID, receiverID],
      messages: [],
    });

    chat.save().then((chat) => res.json(chat));
  }

  sendMessage(req, res, next) {
    // Get Current User
    const userID = new ObjectId(res.locals._user.id);
    const user = User.findById(userID);

    // Get chatID from form-data
    const chatID = new ObjectId(req.params.id);
    const msgBody = req.body.msgBody;

    // Handle save message on db
    const message = new Message({
      user: userID,
      msgBody,
    });

    message.save().then((msg) => {
      Chat.findById(chatID).then((chat) => {
        chat.messages.push(msg.id);
        chat
          .save()
          .then((chat) =>
            res.json({
              status: 1,
              data: {
                id: msg.id,
                body: msg.msgBody,
                status: msg.status,
                time: msg.createdAt,
                user: msg.user,
              },
            })
          )
          .catch((err) =>
            res.json({
              isSuccess: false,
              error: err,
            })
          );
      });
    });
  }
}

module.exports = new MessageController();
