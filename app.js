const config = require('./config');
const express = require('express');
const path = require('path');
const logger = require('morgan');
const bodyParser = require('body-parser');
const dustjs = require('adaro');
const app = express();

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
    extended: false
})); // parse application/x-www-form-urlencoded
app.use(bodyParser.json()); // parse application/json
app.use(express.static(path.join(__dirname, 'public')));

// Initialize routers here

const routers = require('./routes/routers');
app.use('/', routers.root);
app.use('/rooms', routers.rooms);
//Welcome view
app.use('/welcome', routers.welcome);
app.post('/welcome', routers.welcome);
//Register view
app.use('/register', routers.register);
//Users view (contacts page)
app.use('/users', routers.users);
app.use('/room', routers.room); // to view the room page


module.exports = app;
