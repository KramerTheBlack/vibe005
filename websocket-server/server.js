const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
  },
});

const JWT_SECRET = process.env.JWT_SECRET || 'secret';

io.use((socket, next) => {
  const token = socket.handshake.query.token;
  if (!token) return next(new Error('No token'));
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    socket.userId = decoded.id;
    next();
  } catch (error) {
    next(new Error('Invalid token'));
  }
});

io.on('connection', (socket) => {
  socket.join(`user_${socket.userId}`);
  console.log(`User ${socket.userId} connected`);
});

app.use(express.json());

app.post('/emit', (req, res) => {
  const { userId, event, data } = req.body;
  io.to(`user_${userId}`).emit(event, data);
  res.sendStatus(200);
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`WebSocket server on port ${PORT}`);
});
