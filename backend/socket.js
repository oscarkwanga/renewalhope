// socket.js
const { Server } = require('socket.io');
let io;

const initSocket = (httpServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: [
        'http://localhost:3000',           // React dev
        'https://alfahomes.onrender.com',
        'https://admindwelify.onrender.com'
      ],
      methods: ['GET', 'POST'],
      credentials: true
    },
    // Only allow pure WebSocket—no HTTP polling
    transports: ['websocket'],
    allowUpgrades: false
  });

  io.on('connection', (socket) => {
    console.log('✅ Socket connected (WS only):', socket.id);
    socket.on('disconnect', () => {
      console.log('❌ Socket disconnected:', socket.id);
    });
  });

  return io;
};

const getSocket = () => {
  if (!io) throw new Error('Socket.io not initialized!');
  return io;
};

module.exports = { initSocket, getSocket };
