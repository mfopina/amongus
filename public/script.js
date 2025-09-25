const socket = io();

// Manipulando a criação e entrada nas salas
document.getElementById('createRoomBtn').addEventListener('click', () => {
  const roomName = document.getElementById('roomName').value;
  socket.emit('createRoom', roomName);
});

document.getElementById('joinRoomBtn').addEventListener('click', () => {
  const roomName = document.getElementById('roomName').value;
  socket.emit('joinRoom', roomName);
});

// Recebendo respostas do servidor
socket.on('roomCreated', (roomName) => {
  alert(`Sala ${roomName} criada com sucesso!`);
  document.getElementById('gameArea').style.display = 'block';
});

socket.on('newPlayer', (playerId) => {
  console.log('Novo jogador entrou: ' + playerId);
});

socket.on('gameStarted', () => {
  alert('O jogo começou!');
});

socket.on('error', (msg) => {
  document.getElementById('error').textContent = msg;
});
