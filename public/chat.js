window.onload = function () {
  var messages = [];
  var socket = io.connect("http://localhost:3700");
  var field = document.getElementById("field");
  var sendButton = document.getElementById("send");
  var content = document.getElementById("content");
  var name = document.getElementById("name");

  var updateContent = function () {
    var html = "";
    for (var i = 0; i < messages.length; i++) {
      if (messages[i].username) {
        html += "<b>" + messages[i].username + ":</b>";
      }
      html += messages[i].message + "<br/>";
    }
    content.innerHTML = html;
  };

  var messageTypingDisplayed = function () {
    if (messages.length > 0) {
      var lastMessage = messages[messages.length - 1].message;
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
      messages.push(data);
      updateContent();
    } else {
      console.log("Something went wrong");
    }
  });

  socket.on("typing_message", function (data) {
    if (!messageTypingDisplayed()) {
      messages.push(data);
      updateContent();
    }
  });

  var sendMessage = function () {
    if (name.value === "") {
      alert("Please type in your name");
    } else {
      socket.emit("send", { message: field.value, username: name.value });
      field.value = "";
    }
  };

  sendButton.onclick = function () {
    sendMessage();
  };

  field.onkeyup = function (event) {
    if (event.keyCode == 13) {
      sendMessage();
    }
  };

  field.onkeypress = function () {
    socket.emit("typing");
  };
};
