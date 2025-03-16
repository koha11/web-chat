const mongoose = require('mongoose');
const mongooseDelete = require('mongoose-delete');

const Schema = mongoose.Schema;
const User = require('./User');

// Tao model
const Message = new Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    msgBody: { type: String, required: true },
    status: { type: Boolean, required: true, default: false },
  },
  { timestamps: true }
);

//add plugin
Message.plugin(mongooseDelete, {
  overrideMethods: 'all', //Ghi de may cai ham tim, update thanh tim, update nhung cai chua xoa (thuoc tinh deleted: false)
  deletedAt: true, //Them atb thoi gian xoa cho model
});

//export model
module.exports = mongoose.model('Message', Message);
