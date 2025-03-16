const mongoose = require('mongoose');

function connect() {
  mongoose
    .connect('mongodb://localhost:27017/WebChatDB', {})
    .then((val) => {
      console.log('Successfully connect to MongoDB.');
      //initial();
    })
    .catch((err) => {
      console.error('Connection error', err);
      process.exit();
    });

  //   function initial() {
  //     Role.countDocuments({}).then((count) => {
  //       if (count === 0) {
  //         const roles = ['reader', 'admin', 'author', 'writer'];

  //         for (let role of roles)
  //           new Role({
  //             name: role,
  //           })
  //             .save()
  //             .then(() => console.log(`added '${role}' to roles collection`))
  //             .catch((err) => console.log(err));
  //       }
  //     });

  //     Genre.countDocuments({}).then((count) => {
  //       if (count === 0) {
  //         const genres = [
  //           'Action',
  //           'Adult',
  //           'Romance',
  //           'Short Story',
  //           'Horror',
  //           'Humor',
  //           'Science Fiction',
  //           'Adventure',
  //           'Comedy',
  //           'Fantasy',
  //           'Mystery',
  //           'paranormal',
  //         ];

  //         for (let genre of genres)
  //           new Genre({
  //             name: genre,
  //           })
  //             .save()
  //             .then(() => console.log(`added '${genre}' to genres collection`))
  //             .catch((err) => console.log(err));
  //       }
  //     });
  //   }
}

module.exports = { connect };
