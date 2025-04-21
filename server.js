const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
app.use(cors());
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

let players = [
  { name: "Player 1", basePrice: 1000 },
  { name: "Player 2", basePrice: 2000 },
  { name: "Player 3", basePrice: 1500 },
  { name: "Player 4", basePrice: 3000 }
];

let currentIndex = 0;

io.on('connection', (socket) => {
  console.log('A user connected');

  socket.emit('updatePlayers', players);
  socket.emit('currentPlayer', players[currentIndex]);

  socket.on('assignTeam', ({ playerIndex, team }) => {
    players[playerIndex].team = team;
    io.emit('updatePlayers', players);
  });

  socket.on('nextPlayer', () => {
    if (currentIndex < players.length - 1) {
      currentIndex++;
      io.emit('currentPlayer', players[currentIndex]);
    }
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
