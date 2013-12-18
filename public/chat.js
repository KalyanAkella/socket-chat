window.onload = function () {
  var messages = [];
  var socket = io.connect("http://localhost:3700");
  var field = document.getElementById("field");
  var sendButton = document.getElementById("send");
  var content = document.getElementById("content");

  var updateContent = function () {
    var html = "";
    for (var i = 0; i < messages.length; i++) {
      html += messages[i] + "<br/>"
    }
    content.innerHTML = html;
  };

  var messageTypingDisplayed = function () {
    if (messages.length > 0) {
      var lastMessage = messages[messages.length - 1];
      return lastMessage.substring(0, 3) === "<i>";
    }
    return false;
  };

  var removeMessageTyping = function () {
    if (messageTypingDisplayed()) {
      messages = messages.slice(0, messages.length - 1);
    }
  };

  socket.on("message", function (data) {
    if (data.message) {
      removeMessageTyping();
      messages.push(data.message);
      updateContent();
      field.value = "";
    } else {
      console.log("Something went wrong");
    }
  });

  socket.on("typing_message", function () {
    if (!messageTypingDisplayed()) {
      messages.push("<i>Someone typing</i>");
      updateContent();
    }
  });

  sendButton.onclick = function () {
    socket.emit("send", { message: field.value });
  };

  field.onkeyup = function (event) {
    if (event.keyCode == 13) {
      socket.emit("send", { message: field.value });
    }
  };

  field.onkeypress = function () {
    socket.emit("typing");
  };
};
