const fs = require("fs");
const path = require('path');

const createError = require('http-errors');
const express = require('express');
const session = require('express-session');
const logger = require('morgan');
const sassMiddleware = require('node-sass-middleware');
const debug = require('debug')('buzz-in:server');

const config = require('./data/config.json');
const indexRouter = require('./routes/index');
const hostRouter = require('./routes/host');

const saveFilePath = path.join(__dirname, '/data/save.json');

if (!fs.existsSync(saveFilePath)) {
  debug('No save file found, creating one...');
  fs.writeFileSync(saveFilePath, '{}');
}

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

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

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
