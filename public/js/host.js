function HostApp(password) {
  this.connect(password);

  this.buzzerList = document.getElementById('buzzer-list');
  this.playerList = document.getElementById('player-list');
  this.players = {};

  /*document.getElementById('btn-join').addEventListener('click', this.tryToConnect.bind(this));
  this.buzzer.addEventListener('click', this.handleBuzzerPush.bind(this));*/
}

HostApp.prototype = {
  socket: null,
  buzzerList: null,
  firstBuzzerTime: null,
  players: null,

  connect: function (password) {
    this.socket = io();
    this.socket.on('connect', function () {
      this.socket.emit('host-join', {
        password: password
      });
    }.bind(this));

    this.socket.on('player-joined', this.onPlayerJoin.bind(this));
    this.socket.on('buzzer', this.onBuzzer.bind(this));
  },

  onPlayerJoin: function (data) {
    this.players[data.id] = {
      name: data.name,
      team: data.team
    };

    var li = document.createElement('li');
    li.innerHTML = data.name + '(' + data.team + ')';

    this.playerList.appendChild(li);
    this.players[data.id].el = li;
  },

  onBuzzer: function (data) {
    var time;
    var li = this.players[data.player].el;

    if (li) {
      if (!this.firstBuzzerTime) {
        time = '';
      } else {
        time = Number((data.time - this.firstBuzzerTime) / 1000).toFixed(3);
        time = ' (+' + time + 's)';
      }

      li.innerHTML = li.innerText + '<time>' + time + '</time>';
      this.buzzerList.appendChild(li);

      this.firstBuzzerTime = data.time;
    }
  }
};

HostApp.init = function (password) {
  window.client = new HostApp(password);
};
