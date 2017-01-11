var socket = io.connect();
var me;
var turnId;

var table = $('table');

var statusLabel = $("#status");
var userLabel = $("#user");
var turnLabel = $("#turn");
var replayLabel = $("#replay");
var gameId = null;


function changeTurnLabel(turnLabelSelector) {
    if(turnLabelSelector.text().toLowerCase() == "you"){
        turnLabelSelector.text("Opponent");
        turnLabelSelector.css('color', 'red');
    }
    else{
        turnLabelSelector.text("You");
        turnLabelSelector.css('color', 'green');
    }
}

$(document).ready(function(){
    $(window).bind("beforeunload", function() {
        socket.disconnect();
        return alert("You left the game.");
    });
});

$('td').click(function(){
    if(turnId != socket.id)
        return alert("It's not your turn.");
    if($(this).text() == ''){
        $(this).text(me.name);
        socket.emit('new click', {index: $(this).attr('id'), user: me});
    }
    else
        return alert('This cell is not empty.\nPlease choose another cell.');
});

replayLabel.click(function () {
    if(gameId == null)
        return alert('Game is not finished yet.');
    for(var i = 0; i < 9; i++)
        $('#' + i).text("");
    table.fadeIn(1000);
    socket.emit('replay', {id: gameId});
});

socket.on('init', function(info){
    me = info;
    userLabel.text(info.name)
});

socket.on('started', function(data){
    table.fadeIn(1500);
    statusLabel.text(data.message);
    turnId = data.turn.id;
    if(turnId == socket.id){
        turnLabel.text('You');
        turnLabel.css('color', 'green');
    }
    else{
        turnLabel.text('Opponent');
        turnLabel.css('color', 'red');
    }
});

socket.on('new replay', function(data){
    // Because of time limit, I just implemented replay in client side with once server push
    var mRecord = data.record;
    var showCounter = 0;
    var timer = setInterval(function(){
        if(showCounter >= mRecord.logs.length)
            return clearInterval(timer);
        $("#" + mRecord.logs[showCounter].index).text(mRecord.logs[showCounter].user.name);
        showCounter++;
    },1000);
});

socket.on('new update', function(data){
    turnId = data.turnUser.id;
    for(var i in data.filled){
        if(data.filled[i] != 0 && data.filled[i].name)
            $('#' + i).text(data.filled[i].name);
        else
            $('#' + i).text('');
        $('#' + i).css('color', data.filled[i].name == 'O' ? 'lightcoral' : 'lightseagreen');
    }
    changeTurnLabel(turnLabel);
});

socket.on('finished', function(data){
    if(data.winner)
        statusLabel.css('color', data.winner.id == me.id ? 'green' : 'red');
    else
        statusLabel.css('color', 'purple');

    gameId = data.gameId;

    statusLabel.text(data.message);
    turnLabel.text('Refresh the page, if you want play again.');
    turnLabel.css('color', 'gray');
    table.fadeOut(500);
    replayLabel.fadeIn(200);
});

socket.on('left', function(info){
    $('table').fadeOut(1500);
    if(info.message){
        statusLabel.text(info.message);
        statusLabel.css('color', 'red');
        turnLabel.html('<i>Disconnected, Reload the page.</i>');
        turnLabel.css('color', 'gray');
    }
});


