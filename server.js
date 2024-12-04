const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static('public'));

app.get('/events', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  setInterval(() => {
    res.write(`data: ${new Date().toISOString()}\n\n`);
  }, 1000);
});

io.on('connection', (socket) => {
  console.log('Новый пользователь подключился');

  socket.on('sendMessage', (message) => {
    io.emit('newMessage', message);
  });

  socket.on('disconnect', () => {
    console.log('Пользователь отключился');
  });
});

server.listen(3000, () => {
  console.log('Сервер работает на http://localhost:3000');
});
