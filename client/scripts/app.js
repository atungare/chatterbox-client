// YOUR CODE HERE:

var app = {};

app.user = window.location.search.slice(10);
app.server = 'https://api.parse.com/1/classes/chatterbox';

app.rooms = [];

app.init = function(){

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
    app.fetch($("#room").val());
  });

  $('#send').on('submit', function(e){
    e.preventDefault();
    e.stopPropagation();
    app.handleSubmit();
  });

  $(".username").on('click', function(){
    app.addFriend();
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

app.fetch = function(room){
  $.ajax({
    url: app.server,
    type: 'GET',
    data: {order: "-createdAt"},
    success: function(data){
      var msgArr = data["results"];

      if(!room || (room === "lobby")){
        app.getCurrentRooms(msgArr);
        for(var i = 0; i < msgArr.length; i++){
          app.addMessage(msgArr[i]);
        }
      } else {
        for(var i = 0; i < msgArr.length; i++){
          if(msgArr[i]['roomname'] === room){
            app.addMessage(msgArr[i]);
          }
        }
      }
    }
  });
};

app.clearMessages = function() {
  $("#chats").empty();
};

app.addMessage = function(message) {
  if(app.msgIsSafe(message)){
    var msg = "<div class=\""+message.roomname+"\"><h2 class=\"username\">" + message.username + "</h2><p class=\"txt\">" + message.text + "</p></div>";
    $("#chats").append(msg);
  }
};

app.getCurrentRooms = function(msgArr) {
  $("#room").empty();
  $("#room").append("<option value=\"lobby\">Lobby</option>");

  for(var i = 0; i < msgArr.length; i++) {
    var curRoom = msgArr[i]["roomname"];
    if(app.msgIsSafe(msgArr[i])) {
      if(app.rooms.indexOf(curRoom) === -1) {
        app.rooms.push(curRoom);
      }
    }
  }

  for(var i = 0; i < app.rooms.length; i++) {
    var thisRoom = app.rooms[i];
    $("#room").append("<option value=\""+thisRoom+"\">"+ thisRoom + "</option>");
  }
};

app.addRoom = function(){
  var newRoom = prompt("Enter new room name:") || "lobby";
  var newMessage = prompt("Enter your message:") || "Hello World!";

  if(app.isSafe(newRoom) && app.isSafe(newMessage)){
    if(app.rooms.indexOf(newRoom) === -1) {
      app.rooms.push(newRoom);
    }
    var msg = {
      username: app.user,
      text: newMessage,
      roomname: newRoom,
    };
    app.send(msg);

    $("#room").prepend("<option value=\""+newRoom+"\">"+ newRoom + "</option>");
    $("#room").val(newRoom);
    $("#room").trigger("change");
  }
};

app.addFriend = function(){

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
    }
  }

  return isSafe;
};

app.msgIsSafe = function(msg) {
  return (app.isSafe(msg.roomname) && app.isSafe(msg.text) && app.isSafe(msg.username));
};

$(document).ready(function(){app.init();});

