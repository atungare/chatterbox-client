// YOUR CODE HERE:

var app = {};

app.init = function(){
  this.user = window.location.search.slice(10);
  this.server = 'https://api.parse.com/1/classes/chatterbox';

  this.send({username:this.user,text:"hi",roomname:"lobby"});

  $(".username").on('click', function(){
    app.addFriend();
  });

  $("#send").on('click', function(){
    app.handleSubmit();
    console.log("test");
  });
};

app.handleSubmit = function(){
  var myText = $("#message").val();
  $("#message").val("");
  var message = {
    username: this.user,
    text: myText,
    roomname: 'lobby'
  };
  console.dir(message);
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
    success: function(data){
      for(var i=0; i<20; i++){
        app.addMessage(data['results'][i]);
      }
    }
  });
};

app.clearMessages = function() {
  $("#chats").empty();
};

app.addMessage = function(message) {
  var msg = "<div class=\""+message.roomname+"\"><h2 class=\"username\">" + message.username + "</h2><p class=\"txt\">" + message.text + "</p></div>";
  $("#chats").append(msg);
};

app.addRoom = function(roomname){
  $("#roomSelect").append("<div>"+roomname+"</div>");
};

app.addFriend = function(){

};

app.init();
