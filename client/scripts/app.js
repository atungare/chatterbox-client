// YOUR CODE HERE:

var app = {};

app.user = window.location.search.slice(10);
app.server = 'https://api.parse.com/1/classes/chatterbox';

app.rooms = {};
app.currentRoom = 'lobby';

app.friends = {};

app.init = function(){

  if(!app.isSafe(app.user)) {
    app.user = 'anonymous';
  }

  app.displayUser();

  $(".switchUser").on("click", function(){
    var newName = prompt("Enter new user name:") || "anonymous";
    if(app.isSafe(newName)){
      app.user = newName;
      app.displayUser();
    }
  });

  $(".newRoom").on("click", function(){
    app.addRoom();
  });

  $(".refresh").on('click', function(){
    app.clearMessages();
    app.fetch();
  });

  $("#room").on("change", function(){
    app.clearMessages();
    app.currentRoom = $("#room").val();
    app.fetch();
  });

  $('#send').on('submit', function(e){
    e.preventDefault();
    e.stopPropagation();
    app.handleSubmit();
  });

  $("#chats").on('click', ".username", function(){
    app.addFriend($(this).text());
  });

  app.fetch();
};

app.displayUser = function() {
  $("#username").text("Welcome, " +app.user + "!");
};

app.handleSubmit = function(){
  var myText = $("#message").val();

  $("#message").val("");

  var message = {
    username: this.user,
    text: myText,
    roomname: $("#room").val()
  };

  app.send(message);

  $("#room").trigger("change");
};

app.send = function(message){
  $.ajax({
    url: app.server,
    type: 'POST',
    data: JSON.stringify(message),
    contentType: 'application/json',
    success: function(data) {
      console.log('chatterbox: Message sent', data);
    },
    error: function(data) {
      console.error('chatterbox: Failed to send message', data);
    }
  });
};

app.fetch = function(){
  $.ajax({
    url: app.server,
    type: 'GET',
    data: {order: "-createdAt"},
    success: function(data){
      app.displayMessages(data["results"]);
    }
  });
};

app.displayMessages = function(msgArr) {
  if(app.currentRoom === "lobby"){
    app.getCurrentRooms(msgArr);
    for(var i = 0; i < msgArr.length; i++){
      app.addMessage(msgArr[i]);
    }
  } else {
    for(var i = 0; i < msgArr.length; i++){
      if(msgArr[i]['roomname'] === app.currentRoom){
        app.addMessage(msgArr[i]);
      }
    }
  }
};

app.clearMessages = function() {
  $("#chats").empty();
};

app.addMessage = function(message) {
  if(app.msgIsSafe(message)){
    var $msg = $("<div class=\""+message.roomname+"\"><h2 class=\"username\">" + message.username + "</h2><p class=\"txt\">" + message.text + "</p></div>");
    if(app.friends.hasOwnProperty(message.username)) {
      $msg.css("color", "blue");
      $msg.find(".txt").css("font-weight", "bold");
    }
    $("#chats").append($msg);
  }
};

app.getCurrentRooms = function(msgArr) {
  $("#room").empty();
  if(!app.rooms.hasOwnProperty('lobby')) {
    app.rooms['lobby'] = true;
  }

  for(var i = 0; i < msgArr.length; i++) {
    if(app.msgIsSafe(msgArr[i])) {
      var curRoom = msgArr[i]["roomname"];
      if(!app.rooms.hasOwnProperty(curRoom)) {
        app.rooms[curRoom] = true;
      }
    }
  }

  for(var k in app.rooms) {
    var thisRoom = k;
    $("#room").append("<option value=\""+thisRoom+"\">"+ thisRoom + "</option>");
  }
};

app.addRoom = function(){
  var newRoom = prompt("Enter new room name:") || "lobby";
  var newMessage = prompt("Enter your message:") || "Hello World!";

  if(app.isSafe(newRoom) && app.isSafe(newMessage)){
    app.currentRoom = newRoom;

    if(!app.rooms.hasOwnProperty(app.currentRoom)) {
      app.rooms[app.currentRoom] = true;
    }

    var msg = {
      username: app.user,
      text: newMessage,
      roomname: app.currentRoom,
    };

    app.send(msg);

    $("#room").prepend("<option value=\""+app.currentRoom+"\">"+ app.currentRoom + "</option>");
    $("#room").val(app.currentRoom);
    $("#room").trigger("change");
  }
};

app.addFriend = function(friendName){
  if(app.friends.hasOwnProperty(friendName)) {
    delete app.friends[friendName];
  } else {
    app.friends[friendName] = true;
  }

  $("#room").trigger("change");
};

app.isSafe = function(str){

  var isSafe = true;

  if(typeof str !== "string"){
    isSafe = false;
  } else if (str.length > 140){
    isSafe = false;
  } else {
    var obj = {};

    for(var i = 0; i < str.length; i++) {
      obj[str[i]] = true;
    }

    if (obj.hasOwnProperty("<")){
      isSafe = false;
    } else if (obj.hasOwnProperty(">")){
      isSafe = false;
    } else if (obj.hasOwnProperty("\"")){
      isSafe = false;
    } else if (obj.hasOwnProperty("\/")){
      isSafe = false;
    } else if (obj.hasOwnProperty("\\")){
      isSafe = false;
    } else if (obj.hasOwnProperty("'")){
      isSafe = false;
    } else if (obj.hasOwnProperty("?")){
      isSafe = false;
    } else if (obj.hasOwnProperty("$")){
      isSafe = false;
    } else if (obj.hasOwnProperty("&")){
      isSafe = false;
    } else if (obj.hasOwnProperty("(")){
      isSafe = false;
    } else if (obj.hasOwnProperty(")")){
      isSafe = false;
    } else if (obj.hasOwnProperty("|")){
      isSafe = false;
    } else if (obj.hasOwnProperty("%")){
      isSafe = false;
    } else if (obj.hasOwnProperty(";")){
      isSafe = false;
    }
  }

  return isSafe;
};

app.msgIsSafe = function(msg) {
  return (app.isSafe(msg.roomname) && app.isSafe(msg.text) && app.isSafe(msg.username));
};

$(document).ready(function(){app.init();});

