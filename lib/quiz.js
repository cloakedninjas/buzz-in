const config = require('../data/config.json');

class Quiz {
  constructor(io) {
    this.io = io;
    this.clients = {
      host: null,
      players: []
    };

    io.on('connection', (socket) => {
      socket.on('disconnect', () => {
        console.log('user disconnected');
      });
    });
  }

  authenticateUser(socket, data, callback) {
    if (data.password === null) {
      this.clients.players.push({
        id: socket.id,
        name: data.name
      });
      return callback(null, true);
    }

    if (data.password === config.host_password) {
      this.clients.host = socket.id;
      return callback(null, true);
    }

    return callback(null, false);
  }

  postAuthenticateUser(socket, data) {
    if (this.clients.host !== socket.id) {
      socket.to(this.clients.host).emit('player-joined', data);
    }
  }
}

module.exports = Quiz;
