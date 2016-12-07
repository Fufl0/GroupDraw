const config = require('./config');
const express = require('express');
const path = require('path');
const logger = require('morgan');
const bodyParser = require('body-parser');
const dustjs = require('adaro');
const app = express();
const session = require('express-session');

// Connect to MongoDB here
const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
mongoose.connect(config.mongoUrl + config.mongoDbName);
require('./models');

// dustjs view engine setup
app.engine('dust', dustjs.dust());
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'dust');

//configure app
app.use(logger('dev'));
app.use(bodyParser.urlencoded({
  limit: '50mb',
  extended: true
})); // parse application/x-www-form-urlencoded
app.use(bodyParser.json({
  limit: '50mb'
})); // parse application/json
app.use(express.static(path.join(__dirname, 'public')));
//session control
app.use(session({
  secret: Math.random().toString(36).substr(2),
  resave: false,
  saveUninitialized: true}));

// Initialize routers here

const routers = require('./routes/routers');
app.use('/', routers.root);
app.use('/rooms', routers.rooms);
//Welcome view
app.use('/welcome', routers.welcome);
app.post('/welcome', routers.welcome.loginUser);
//Register view
app.use('/register', routers.register);
app.post('/register', routers.register.postUser);
//Users view
app.use('/users', routers.users);
//Profile view
app.get('/profile', routers.profile);
//Gallery view
app.use('/gallery', routers.gallery);


module.exports = app;
