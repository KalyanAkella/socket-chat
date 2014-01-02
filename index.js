var express = require('express');
var app = express();
var twitter = require('./twitter');
var config = require('./config');

app.set("views", __dirname + "/templates");
app.set("view engine", "jade");
app.engine("jade", require("jade").__express);
app.use(express.cookieParser());
app.use(express.session({secret: '1234567890QWERTY'}));

app.get("/", function (req, res) {
  twitter.getUser(req, res);
  res.render("page");
});

app.get("/twitter_login", twitter.login);
app.get("/twitter_redirect", twitter.redirect);

app.use(express.static(__dirname + "/public"));

var port = config.port;
var io = require('socket.io').listen(app.listen(port));
console.log("Listening on port " + port);

io.sockets.on('connection', function (socket) {
  socket.emit('message', { message: "welcome to the chat", username: "server" });

  socket.on('send', function (data) {
    io.sockets.emit('message', data);
  });

  socket.on('typing', function (data) {
    io.sockets.emit('typing_message', { message: "<i>Someone typing</i>" });
  });
});
