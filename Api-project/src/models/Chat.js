const mongoose = require('mongoose');
const mongooseDelete = require('mongoose-delete');

const Schema = mongoose.Schema;
const User = require('./User');
const Message = require('./Message');

// Tao model
const Chat = new Schema(
  {
    users: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    messages: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Message' }],
  },
  { timestamps: true }
);

//add plugin
Chat.plugin(mongooseDelete, {
  overrideMethods: 'all', //Ghi de may cai ham tim, update thanh tim, update nhung cai chua xoa (thuoc tinh deleted: false)
  deletedAt: true, //Them atb thoi gian xoa cho model
});

//export model
module.exports = mongoose.model('Chat', Chat);
