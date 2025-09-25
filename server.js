const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

let rooms = {}; // Armazenamento das salas de jogo

// Servindo arquivos estáticos (HTML, CSS, JS)
app.use(express.static('public'));

// Rota para o lobby (sala de espera)
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

// Manipulando conexão dos jogadores
io.on('connection', (socket) => {
  console.log('Novo jogador conectado: ' + socket.id);

  socket.on('createRoom', (roomName) => {
    if (!rooms[roomName]) {
      rooms[roomName] = { players: [] };
      socket.join(roomName);
      rooms[roomName].players.push(socket.id);
      console.log(`Sala ${roomName} criada. Jogador entrou.`);
      socket.emit('roomCreated', roomName);
    } else {
      socket.emit('error', 'Sala já existe!');
    }
  });

  socket.on('joinRoom', (roomName) => {
    if (rooms[roomName]) {
      socket.join(roomName);
      rooms[roomName].players.push(socket.id);
      console.log(`Jogador entrou na sala ${roomName}`);
      io.to(roomName).emit('newPlayer', socket.id);
    } else {
      socket.emit('error', 'Sala não encontrada!');
    }
  });

  socket.on('startGame', (roomName) => {
    if (rooms[roomName] && rooms[roomName].players.length > 1) {
      io.to(roomName).emit('gameStarted');
      console.log(`Jogo iniciado na sala ${roomName}`);
    } else {
      socket.emit('error', 'É necessário mais de 1 jogador para iniciar o jogo!');
    }
  });

  socket.on('disconnect', () => {
    console.log('Jogador desconectado: ' + socket.id);
    for (const room in rooms) {
      const index = rooms[room].players.indexOf(socket.id);
      if (index !== -1) {
        rooms[room].players.splice(index, 1);
        io.to(room).emit('playerLeft', socket.id);
      }
    }
  });
});

// Iniciar o servidor
server.listen(3000, () => {
  console.log('Servidor rodando na porta 3000');
});
