const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const axios = require("axios"); // לשלוח בקשה ל-Colab

const app = express();
app.use(cors({ origin: "http://localhost:3000" }));
app.use(express.json());

// Route בסיסי לבדיקה
app.get("/", (req, res) => res.send("✅ Backend works!"));

const server = http.createServer(app);

const io = socketIo(server, {
  cors: { origin: "http://localhost:3000", methods: ["GET", "POST"] }
});

io.on('connection', (socket) => {
  console.log('✅ New client connected, id:', socket.id);

  socket.on('generate-video', async (description) => {
    console.log('📩 Sending description to Colab:', description);

    try {
      // שולחים POST ל-Colab שמייצר את הוידאו ב-GPU
      const colabUrl = "https://94503e26a14c.ngrok-free.app/generate"; // החלף לכתובת ngrok של Colab
const response = await axios.post(colabUrl, { description }, {
  headers: { "Content-Type": "application/json" }
});
      // החזרת URL של הוידאו מה-Colab ל-Frontend
      const videoUrl = response.data.video_url;
      console.log("📩 Video ready at:", videoUrl);
      socket.emit('video-ready', videoUrl);

    } catch (err) {
      console.error('❌ Error generating video:', err.message);
      socket.emit('error', 'Failed to generate video');
    }
  });

  socket.on('disconnect', () => console.log('❎ Client disconnected'));
});

server.listen(5000, () => console.log('🚀 Server running on port 5000'));
