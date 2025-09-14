const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const { generateFrames } = require('./worker'); // worker.js שלך

const app = express();

// CORS – מאפשר חיבור רק מה־Frontend שלך
app.use(cors({ origin: "http://localhost:3000" }));
app.use(express.json());

// Route בסיסי לבדיקה
app.get("/", (req, res) => res.send("✅ Backend works!"));

// יצירת שרת HTTP
const server = http.createServer(app);

// Socket.IO – חיבור עם CORS
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

// מאזינים לחיבורי Socket.IO
io.on('connection', (socket) => {
  console.log('✅ New client connected, id:', socket.id);

  socket.on('generate-video', async (description) => {
    console.log('📩 Received description:', description);

    try {
      const framesPath = await generateFrames(description);
      console.log('🖼️ Frames created at:', framesPath);

      // שולח ל־Frontend (כרגע רק Placeholder)
      socket.emit('video-ready', `${framesPath}video.mp4`);
    } catch (err) {
      console.error('❌ Error generating video:', err);
      socket.emit('error', 'Failed to generate video');
    }
  });

  socket.on('disconnect', () => console.log('❎ Client disconnected'));
});

// הרצת השרת
server.listen(5000, () => console.log('🚀 Server running on port 5000'));
