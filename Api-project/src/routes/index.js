const homeRouter = require('./home');
const messageRouter = require('./message');
const accountRouter = require('./me');

function route(app) {
  app.use('/', homeRouter);
  app.use('/m', messageRouter);
  app.use('/me', accountRouter);
}

module.exports = route;
