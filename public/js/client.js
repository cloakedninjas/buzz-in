function ClientApp() {
  this.nameInput = document.getElementById('player-name');
  this.teamSelect = document.getElementById('team-select');
  this.buzzer = document.querySelector('#buzzer button');

  document.getElementById('btn-join').addEventListener('click', this.tryToConnect.bind(this));
  this.buzzer.addEventListener('click', this.handleBuzzerPush.bind(this));
}

ClientApp.prototype = {
  socket: null,

  tryToConnect: function () {
    if (this.nameInput.value && this.teamSelect.value) {
      this.connect();
      var welcome = document.getElementById('welcome');
      welcome.parentNode.removeChild(welcome);
      document.getElementById('buzzer').classList.add('visible');
    }
  },

  connect: function () {
    this.socket = io();
    this.socket.on('connect', function () {
      this.socket.emit('player-join', {
        name: this.nameInput.value,
        team: this.teamSelect.value
      });
    }.bind(this));
  },

  handleBuzzerPush: function () {
    this.socket.emit('buzzer');
  }
};

ClientApp.init = function () {
  window.client = new ClientApp();
};

document.addEventListener('DOMContentLoaded', ClientApp.init);
