var express = require('express');
var router = express.Router();
var io = require('socket.io')(http);

Array.prototype.repeat= function(what, L){
    while(L) this[--L]= what;
    return this;
}

var user1 = '', user2 = '', currentUser, turn;
var isStarted = false;
var isFinished = false;
var steps = [], filled = [].repeat(0, 9);

// Check filled cells by following conditions
var winConditions = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [2, 4, 6], [0, 4, 8]];

function checkWinner(filledCells, steps, conditions) {
    var winnerStatus = false;
    if (steps.length < 5)
        return winnerStatus;

    for (var i = 0; i < 8; i++) {
        if (filledCells[conditions[i][0]].id && filledCells[conditions[i][1]].id && filledCells[conditions[i][2]].id) {
            if ((filledCells[conditions[i][0]].id == filledCells[conditions[i][1]].id) && (filledCells[conditions[i][1]].id == filledCells[conditions[i][2]].id)) {
                winnerStatus = true;
                break;
            }
        }
    }
    return winnerStatus;
}


io.on('connection', function (socket) {
    currentUser = {id: socket.id};


    function pushReplayData(i, record, userSocket) {
        userSocket.emit('new replay', {step: 'test for new push'});
        i++;
        if (i <= record.logs.length) {setTimeout(function(){pushReplayData(i);},3000);}
    }

    // First player
    if (user1 == '') {
        currentUser.name = 'X';
        user1 = currentUser;
    }
    // Second player
    else if (user2 == '') {
        currentUser.name = 'O';
        user2 = currentUser;
    }
    console.log('a user connected', currentUser);
    io.sockets.connected[socket.id].emit('init', currentUser);

    // Room is fulled, game has started...
    // Random turn
    if (user1 != '' && user2 != '') {
        isStarted = true;
        turn = Math.floor((Math.random() * 2) + 1) == 1 ? user1 : user2;
        io.emit('started', {turn: turn, message: 'The game has started.'});
    }


    socket.on('new click', function (data) {
        if (isStarted && !isFinished) {
            if (filled[data.index] == 0 && data.user.id == turn.id) {
                filled[data.index] = data.user;
                var relatedUser = (data.user.id == user1.id) ? user1 : user2;
                var newStep = {index: data.index, user: relatedUser}
                steps.push(newStep);
                console.log("New Click on "+data.index+" from "+relatedUser.name);
                if (checkWinner(filled, steps, winConditions)) {
                    isFinished = true;
                    var document = {
                        logs: steps,
                        cells: filled,
                        users: [user1, user2],
                        winner: relatedUser,
                        time: Date.now()
                    };
                    db.insert(document, function(err, doc){
                        io.emit('finished', {
                            winner: relatedUser,
                            message: relatedUser.name + ' has won.',
                            gameId: doc._id
                        });
                    });
                    return;
                }
                // If game finished without winner (Draw)
                else if(steps.length == 9){
                    var document = {
                        logs: steps,
                        cells: filled,
                        users: [user1, user2],
                        time: Date.now()
                    };
                    db.insert(document, function (err, doc) {
                        io.emit('finished', {message: ' DRAW!!!', gameId: doc._id});
                    });
                }

                turn = relatedUser == user1 ? user2 : user1;
                io.emit('new update', {
                    filled: filled,
                    turnUser: turn,
                });
            }
            else
                console.log('failed click');
        }
        else
            io.emit('new error');
    });


    socket.on('replay', function (data) {
        db.find({_id: data.id}, function (err, docs) {
            if(!docs[0])
                return;
            var record = docs[0];
            socket.emit('new replay', {record: record});
        });
    });

    socket.on('disconnect', function (data) {
        console.log('a user disconnected');

        if (!data.isFinished)
            io.emit('left', {message: 'Your opponent left the game.'});

        for(s in io.sockets.sockets)
            io.sockets.sockets[s].disconnect();

        user1 = '';
        user2 = '';
        turn = null;
        isStarted = false;
        isFinished = false;
        steps = [];
        filled = [].repeat(0, 9);
    });

});


/* GET home page. */
router.get('/', function (req, res) {
    if (user1 != '' && user2 != ''){
        res.end('Sorry, room is full.');
        return;
    }
    res.render('index');
});
module.exports = router;
