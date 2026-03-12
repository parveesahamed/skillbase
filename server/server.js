const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Load environment variables
dotenv.config();

// Connect to database
connectDB();

// Initialize express
const app = express();

// Create HTTP server and attach Socket.io
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

// Middleware
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());

// Make io accessible to routes/controllers
app.set('io', io);

// Test route
app.get('/', (req, res) => {
  res.json({ message: '🚀 Server is running!' });
});

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/profile', require('./routes/profile'));
app.use('/api/project', require('./routes/project'));
app.use('/api/match', require('./routes/match'));
app.use('/api/application', require('./routes/application'));
app.use('/api/resume', require('./routes/resume'));
app.use('/api/analytics', require('./routes/analytics'));
app.use('/api/notifications', require('./routes/notification'));
app.use('/api/messages', require('./routes/message'));

// --- Socket.io Connection Logic ---
const onlineUsers = new Map(); // userId -> socketId

io.on('connection', (socket) => {
  console.log('⚡ Socket connected:', socket.id);

  // Map userId to socketId when user registers
  socket.on('register', (userId) => {
    onlineUsers.set(userId, socket.id);
    console.log(`👤 User ${userId} mapped to socket ${socket.id}`);
  });

  // --- Room Management ---
  socket.on('joinRoom', (roomId) => {
    socket.join(roomId);
    console.log(`🚪 Socket ${socket.id} joined room ${roomId}`);
  });

  socket.on('leaveRoom', (roomId) => {
    socket.leave(roomId);
    console.log(`🚪 Socket ${socket.id} left room ${roomId}`);
  });

  // Handle sending a message — broadcast to the project room
  socket.on('sendMessage', (data) => {
    const { receiverId, project } = data;
    const roomId = project?._id || project;

    // Emit to the project room so all participants receive it
    if (roomId) {
      socket.to(roomId).emit('receiveMessage', data);
    }

    // Also try direct delivery in case receiver isn't in the room yet
    const receiverSocket = onlineUsers.get(receiverId);
    if (receiverSocket) {
      io.to(receiverSocket).emit('receiveMessage', data);
    }
  });

  // Handle typing indicator — scoped to project rooms
  socket.on('typing', ({ receiverId, senderName, projectId }) => {
    if (projectId) {
      socket.to(projectId).emit('userTyping', { senderName });
    }
    const receiverSocket = onlineUsers.get(receiverId);
    if (receiverSocket) {
      io.to(receiverSocket).emit('userTyping', { senderName });
    }
  });

  socket.on('stopTyping', ({ receiverId, projectId }) => {
    if (projectId) {
      socket.to(projectId).emit('userStopTyping');
    }
    const receiverSocket = onlineUsers.get(receiverId);
    if (receiverSocket) {
      io.to(receiverSocket).emit('userStopTyping');
    }
  });

  // Handle read receipt
  socket.on('messageRead', ({ messageId, readBy, projectId }) => {
    if (projectId) {
      socket.to(projectId).emit('messageRead', { messageId, readBy });
    }
  });

  // Cleanup on disconnect
  socket.on('disconnect', () => {
    for (const [userId, socketId] of onlineUsers.entries()) {
      if (socketId === socket.id) {
        onlineUsers.delete(userId);
        console.log(`👤 User ${userId} disconnected`);
        break;
      }
    }
  });
});

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
