import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';

// החיבור לשרת Socket.IO
const socket = io('http://localhost:5000'); // כתובת השרת שלך

function VideoGenerator() {
  const [description, setDescription] = useState('');
  const [videoUrl, setVideoUrl] = useState('');

  useEffect(() => {
    // מאזינים להודעות מהשרת
    socket.on('video-ready', (url) => {
      setVideoUrl(url);
    });

    socket.on('error', (err) => {
      alert(err);
    });

    // נתק את החיבור כשהרכיב מתפרק
    return () => socket.disconnect();
  }, []);

  const handleGenerate = () => {
    socket.emit('generate-video', description); // שולחים את התיאור לשרת
  };

  return (
    <div>
      <input
        type="text"
        value={description}
        onChange={e => setDescription(e.target.value)}
        placeholder="כתוב את תיאור הסרטון"
      />
      <button onClick={handleGenerate}>צור סרטון</button>

      {videoUrl && <video src={videoUrl} controls autoPlay />}
    </div>
  );
}

export default VideoGenerator;
