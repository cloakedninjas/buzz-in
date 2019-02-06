const fs = require('fs');
const path = require('path');

const createError = require('http-errors');
const express = require('express');
const session = require('express-session');
const socketIO = require('socket.io');
const socketIOAuth = require('socketio-auth');

const logger = require('morgan');
const sassMiddleware = require('node-sass-middleware');
const debug = require('debug')('buzz-in:server');

const config = require('./data/config.json');
const indexRouter = require('./routes/index');
const hostRouter = require('./routes/host');
const Quiz = require('./lib/quiz');

const saveFilePath = path.join(__dirname, '/data/save.json');

if (!fs.existsSync(saveFilePath)) {
  debug('No save file found, creating one...');
  fs.writeFileSync(saveFilePath, '{}');
}

const app = express();
const io = socketIO();
app.io = io;

const quiz = new Quiz(io);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));

app.use(sassMiddleware({
  src: path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  indentedSyntax: false, // true = .sass and false = .scss
  sourceMap: true
}));

app.use(session({
  secret: config.cookie_secret,
  resave: false,
  saveUninitialized: false
}));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/host', hostRouter);

socketIOAuth(io, {
  authenticate: quiz.authenticateUser.bind(quiz),
  postAuthenticate: quiz.postAuthenticateUser.bind(quiz),
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
