const config = require('../data/config.json');

class Quiz {
  constructor(io) {
    this.io = io;
    this.clients = {
      host: null,
      players: {}
    };
    this.buzzers = [];

    io.on('connection', (socket) => {
      socket.on('disconnect', () => {
        console.log('user disconnected');
      });
    });
  }

  authenticateUser(socket, data, callback) {
    if (data.password === null) {
      this.clients.players[socket.id] = {
        name: data.name,
        team: data.team,
        socket: socket
      };
      return callback(null, true);
    }

    if (data.password === config.host_password) {
      this.clients.host = socket;
      return callback(null, true);
    }

    return callback(null, false);
  }

  postAuthenticateUser(socket, data) {
    if (this.clients.host.id !== socket.id) {
      // inform host player joined
      this.clients.host.emit('player-joined', data);

      // hook up buzzer event
      socket.on('buzzer', this.buzzerPushed.bind(this, socket));
    }
  }

  buzzerPushed(playerSocket) {
    var data = {
      player: playerSocket.id,
      time: (new Date()).getTime()
    };

    this.buzzers.push(data);
    this.clients.host.emit('buzzer', data);
  }
}

module.exports = Quiz;
