// Express app configuration

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
var DB = require('./db');
var session = require('express-session');
var passport = require('passport');
var flash = require('connect-flash');

var app = express();

// User model for authentication
var User = require('../model/user').User;

// Connect to MongoDB
mongoose.connect(DB.URI);
var mongoDB = mongoose.connection;
mongoDB.on('error', console.error.bind(console, 'MongoDB Connection Error:'));
mongoDB.once('open', function () {
  console.log('Connected to MongoDB');
});

// View engine setup
app.set('views', path.join(__dirname, '../views'));
app.set('view engine', 'ejs');

// Middleware
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Static files
app.use(express.static(path.join(__dirname, '../../public')));
app.use(express.static(path.join(__dirname, '../../node_modules')));

// Session
app.use(session({
  secret: process.env.SESSION_SECRET || 'fallback-secret',
  saveUninitialized: false,
  resave: false
}));

// Flash messages
app.use(flash());

// Passport
app.use(passport.initialize());
app.use(passport.session());
passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Routes
var indexRouter = require('../routes/index');
var usersRouter = require('../routes/users');
var booksRouter = require('../routes/book');

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/books', booksRouter);

// 404 handler
app.use(function (req, res, next) {
  next(createError(404));
});

// Error handler
app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.render('error', { title: 'Error' });
});

module.exports = app;
