/**
 * Module dependencies.
 */
var express = require('express');
var bodyParser = require('body-parser');
var routes = require('./routes/index');
var user = require('./routes/user/user');
var friends = require('./routes/friends/friends');
var region = require('./routes/code/region');
var platform = require('./routes/code/platform');
var attribute = require('./routes/attribute/json');
var scheduler = require('./scheduler/scheduler');
var friends = require('./routes/friends/friends');

var app = express();
var port = process.env.PORT || 3000;

app.set('view engine', 'ejs');

// app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({extended: true})); // for parsing application/x-www-form-urlencoded

app.use('/', routes);
app.use('/user', user);
app.use('/friends', friends);
app.use('/region', region);
app.use('/platform', platform);
app.use('/attribute', attribute);
app.use('/friends', friends);

app.listen(port, function () {
    console.log('Server running at http://localhost:3000');
});