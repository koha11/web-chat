const homeRouter = require('./home');
const messageRouter = require('./message');
const accountRouter = require('./me');
const contactRouter = require('./contact');

function route(app) {
  app.use('/', homeRouter);
  app.use('/m', messageRouter);
  app.use('/me', accountRouter);
  app.use('/contact', contactRouter);
}

module.exports = route;
