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

  clientConnected(socket) {
    socket.on('disconnect', this.clientDisconnected.bind(this));
    socket.on('player-join', (data) => {
      this.clients.players[socket.id] = {
        name: data.name,
        team: data.team,
        socket: socket
      };

      // inform host a player joined
      this.messageHost('player-joined', {
        ...data,
        id: socket.id
      });

      // hook up buzzer event
      socket.on('buzzer', this.buzzerPushed.bind(this, socket));
    });

    socket.on('host-join', (data) => {
      if (data.password === config.host_password) {
        this.clients.host = socket;
      }
    });
  }

  messageHost(event, data) {
    if (this.clients.host) {
      this.clients.host.emit(event, data);
    }
  }

  buzzerPushed(playerSocket) {
    var data = {
      player: playerSocket.id,
      time: (new Date()).getTime()
    };

    this.buzzers.push(data);
    this.messageHost('buzzer', data);
  }

  clientDisconnected() {
    console.log('user disconnected');
  }
}

module.exports = Quiz;
