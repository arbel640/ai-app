import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";

let socket;

function App() {
  const [description, setDescription] = useState("");
  const [videoUrl, setVideoUrl] = useState(null);
  const [status, setStatus] = useState("מוכן");

  useEffect(() => {
    // יוצרים את ה־socket פעם אחת בלבד
    if (!socket) {
      console.log("Trying to connect to backend...");
      socket = io("http://localhost:5000", { transports: ["websocket"] });

      socket.on("connect", () => console.log("✅ Connected to backend, id:", socket.id));
      socket.on("connect_error", (err) => console.error("❌ Connection error:", err));
      socket.on("disconnect", (reason) => console.log("❎ Disconnected:", reason));
      socket.on("video-ready", (url) => {
        console.log("📩 Video ready:", url);
        setVideoUrl(url);
        setStatus("הסרטון מוכן!");
      });
      socket.on("error", (err) => {
        console.error("❌ Error from backend:", err);
        setStatus("אירעה שגיאה ביצירת הסרטון");
      });
    }
  }, []);

  const handleGenerate = () => {
    if (!description.trim()) {
      setStatus("נא להזין תיאור קודם");
      return;
    }
    console.log("📤 Sending description to backend:", description);
    setStatus("יוצר סרטון...");
    socket.emit("generate-video", description);
  };

  return (
    <div style={{ padding: 20, fontFamily: "Arial" }}>
      <h1>🎬 יצירת סרטון מ־AI</h1>
      <textarea
        rows={4}
        cols={50}
        placeholder="כתוב כאן תיאור לסרטון..."
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <br />
      <button onClick={handleGenerate} style={{ marginTop: 10 }}>
        צור סרטון
      </button>
      <p>סטטוס: {status}</p>
      {videoUrl && (
        <div>
          <h3>התוצאה:</h3>
          <video controls width="400" src={videoUrl}></video>
        </div>
      )}
    </div>
  );
}

export default App;