// YOUR CODE HERE:

var app = {};

app.user = window.location.search.slice(10);
app.server = 'https://api.parse.com/1/classes/chatterbox';

app.rooms = [];

app.init = function(){


  $(".username").on('click', function(){
    app.addFriend();
  });

  $('#send').on('submit', function(e){
    e.preventDefault();
    e.stopPropagation();
    app.handleSubmit();
  });

  $(".refresh").on('click', function(){
    app.clearMessages();
    app.fetch();
  });

  $(".switchUser").on("click", function(){
    var newName = prompt("Enter new user name:") || "anonymous";
    if(app.isSafe(newName)){
      app.user = newName;
    }
  });

  $(".newRoom").on("click", function(){
    app.addRoom();
  });


  app.fetch();
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
};

app.send = function(message){
  $.ajax({
    url: app.server,
    type: 'POST',
    data: JSON.stringify(message),
    contentType: 'application/json',
    success: function(data) {
      console.log('chatterbox: Message sent', data);
      $('.refresh').click();
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
      var counter = 0;
      while( (counter < 100) && ($("#chats").children().length < 50) ){
        app.addMessage(data['results'][counter]);
        counter++;
      }
      app.clearRooms();
      for(var i = 0; i < app.rooms.length; i++) {
        var thisRoom = app.rooms[i];
        $("#room").append("<option value=\""+thisRoom+"\">"+ thisRoom + "</option>");
      }
    }
  });
};

app.clearRooms = function() {
  $("#room").empty();
};

app.clearMessages = function() {
  $("#chats").empty();
};

app.addMessage = function(message) {
  if(app.isSafe(message.roomname) && app.isSafe(message.text) && app.isSafe(message.username)){
    if(app.rooms.indexOf(message.roomname) === -1) {
      app.rooms.push(message.roomname);
    }
    var msg = "<div class=\""+message.roomname+"\"><h2 class=\"username\">" + message.username + "</h2><p class=\"txt\">" + message.text + "</p></div>";
    $("#chats").append(msg);
  }
};

app.addRoom = function(){
  var newRoom = prompt("Enter new room name:") || "lobby";
  var newMessage = prompt("Enter your message:") || "Hello World!";
  if(app.isSafe(newRoom) && app.isSafe(newMessage)){
    var msg = {
      username: app.user,
      text: newMessage,
      roomname: newRoom,
    };
    app.send(msg);
  }
};

app.addFriend = function(){

};

app.isSafe = function(str){
  var isSafe = true;
  if(typeof str !== 'string'){
    isSafe = false;
  } else if (str.indexOf("<") > -1){
    isSafe = false;
  } else if (str.indexOf(">") > -1){
    isSafe = false;
  } else if (str.indexOf("\"") > -1){
    isSafe = false;
  } else if (str.indexOf("\/") > -1){
    isSafe = false;
  } else if (str.indexOf("\\") > -1){
    isSafe = false;
  } else if (str.indexOf("'") > -1){
    isSafe = false;
  } else if (str.indexOf("?") > -1){
    isSafe = false;
  } else if (str.indexOf("$") > -1){
    isSafe = false;
  } else if (str.indexOf("&") > -1){
    isSafe = false;
  } else if (str.indexOf("(") > -1){
    isSafe = false;
  } else if (str.indexOf(")") > -1){
    isSafe = false;
  } else if (str.indexOf("|") > -1){
    isSafe = false;
  }

  return isSafe;
};

$(document).ready(function(){app.init();});

