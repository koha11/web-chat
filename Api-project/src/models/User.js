const mongoose = require('mongoose');
const mongooseDelete = require('mongoose-delete');

const Schema = mongoose.Schema;

// Tao model
const User = new Schema(
  {
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    fullname: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    isOnline: { type: Boolean, default: false },
    lastLogined: { type: String },
    isActive: { type: Boolean, default: false },
  },
  { timestamps: true }
);

//add plugin
User.plugin(mongooseDelete, {
  overrideMethods: 'all', //Ghi de may cai ham tim, update thanh tim, update nhung cai chua xoa (thuoc tinh deleted: false)
  deletedAt: true, //Them atb thoi gian xoa cho model
});

//export model
module.exports = mongoose.model('User', User);
