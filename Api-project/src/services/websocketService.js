const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');
const MessageService = require('./MessageService');
const UserService = require('./UserService');

function setupWebSocket(server) {
  const io = new Server(server, {
    cors: {
      origin: 'http://localhost:5173',
    },
  });

  const users = new Map();

  io.on('connection', (socket) => {
    let userID;

    jwt.verify(
      socket.handshake.auth.token,
      process.env.JWT_SECRET,
      (err, decoded) => {
        if (err) {
        }
        userID = decoded.id;
      }
    );

    if (userID == null) return;

    users.set(userID, socket.id);
    UserService.setStatus(userID, true);

    console.log('Added user ' + userID);

    MessageService.getChatlist(userID).then((chatIDs) => {
      chatIDs.forEach((chatID) => {
        socket.join(chatID);
      });
    });

    socket.on('isTyping', (chatID) => {
      socket.broadcast.emit('soIsTyping', chatID);
    });

    socket.on('sendMsgFromClient', (msg, chatID) => {
      console.log('Sending ' + msg.msgBody + ' to chat room ' + chatID);
      socket.to(chatID).emit('sendMsgFromServer', msg);
    });

    socket.on('disconnect', () => {
      console.log(userID + ' disconnected');
      users.delete(userID);
      UserService.setStatus(userID, false);
    });
  });

  return io;
}

module.exports = setupWebSocket;
