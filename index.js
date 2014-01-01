var express = require('express');
var app = express();
var port = 3700;

app.set("views", __dirname + "/templates");
app.set("view engine", "jade");
app.engine("jade", require("jade").__express);
app.get("/", function (req, res) {
  res.render("page");
});
app.use(express.static(__dirname + "/public"));

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

  socket.on('twitter_login', function () {
    //
  })
});
