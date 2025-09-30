ঠিক আছে 👍 আমি আবার নতুনভাবে rewrite করে দিলাম, যাতে পুরোটা **Windows–friendly**, step by step, সহজে follow করা যায়।

---

# 🎯 Windows Ready Full Setup (CCTV + Best Frame)

## 🛠️ Overview

1. **4 RTSP Cameras → ffmpeg দিয়ে frame capture**
2. **Node.js Server + Socket.io → frame distribute করবে**
3. **React Admin UI → সব ক্যামেরার thumbnail দেখাবে + select করবে**
4. **React Viewer UI → শুধু select করা ক্যামেরা দেখাবে**

---

## 🔹 Step–1: Install Requirements

### 1) Install Node.js

👉 [Download LTS Version](https://nodejs.org/) → Install.
Test in CMD:

```bash
node -v
npm -v
```

### 2) Install ffmpeg (Windows)

1. Download → [FFmpeg for Windows](https://www.gyan.dev/ffmpeg/builds/)
2. Extract `ffmpeg-release-essentials.zip`
3. Copy **bin** folder path (যেমনঃ `C:\ffmpeg\bin`)
4. Add to **System Environment Variables → PATH**
5. Test:

```bash
ffmpeg -version
```

✅ যদি version দেখায় → কাজ হবে।

---

## 🔹 Step–2: Node.js Server

📂 Project Structure:

```
project/
 ├─ server.js
 ├─ package.json
 └─ frontend/   (React app)
```

### Install dependencies

```bash
npm init -y
npm i express socket.io
```

### `server.js`

```js
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const { spawn } = require("child_process");

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

app.get("/", (req, res) => res.send("🎥 Streaming server running..."));

// === Put your RTSP/RTMP URLs here ===
const CAMS = [
  "rtsp://USER:PASS@192.168.1.101:554/stream1",
  "rtsp://USER:PASS@192.168.1.102:554/stream1",
  "rtsp://USER:PASS@192.168.1.103:554/stream1",
  "rtsp://USER:PASS@192.168.1.104:554/stream1",
];

let selectedCam = null;
const ffprocs = [];

function startCameraProc(camId, rtspUrl) {
  const args = [
    "-rtsp_transport", "tcp",
    "-i", rtspUrl,
    "-vf", "scale=640:360",
    "-r", "8",
    "-f", "image2pipe",
    "-q:v", "5",
    "-vcodec", "mjpeg",
    "-"
  ];

  console.log(`▶ Starting ffmpeg for cam ${camId}`);
  const ff = spawn("ffmpeg", args, { stdio: ["ignore", "pipe", "pipe"] });
  ffprocs[camId] = ff;

  let buffer = Buffer.alloc(0);
  const SOI = Buffer.from([0xff, 0xd8]);
  const EOI = Buffer.from([0xff, 0xd9]);

  ff.stdout.on("data", (chunk) => {
    buffer = Buffer.concat([buffer, chunk]);

    let start = buffer.indexOf(SOI);
    let end = buffer.indexOf(EOI, start + 2);

    while (start !== -1 && end !== -1) {
      const jpeg = buffer.slice(start, end + 2);
      buffer = buffer.slice(end + 2);

      const b64 = jpeg.toString("base64");

      // Send thumbnails to admin
      io.to("admin").emit("cam-frame", { camId, image: b64 });

      // Send only selected camera to viewers
      if (selectedCam === camId) {
        io.to("viewers").emit("best-frame", { camId, image: b64 });
      }

      start = buffer.indexOf(SOI);
      end = buffer.indexOf(EOI, start + 2);
    }
  });

  ff.on("close", () => {
    console.warn(`⚠ ffmpeg for cam ${camId} closed. Restarting...`);
    setTimeout(() => startCameraProc(camId, rtspUrl), 2000);
  });
}

// Start all cams
CAMS.forEach((url, idx) => startCameraProc(idx, url));

io.on("connection", (socket) => {
  console.log("🔗 Connected:", socket.id);

  socket.on("register", (role) => {
    if (role === "admin") {
      socket.join("admin");
      socket.emit("selected-camera", selectedCam);
    } else {
      socket.join("viewers");
    }
  });

  socket.on("select-camera", (camId) => {
    selectedCam = camId;
    io.to("viewers").emit("selected-camera", selectedCam);
    io.to("admin").emit("selected-camera", selectedCam);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
```

Run server:

```bash
node server.js
```

---

## 🔹 Step–3: React Admin UI

### Install client

```bash
npx create-react-app frontend
cd frontend
npm i socket.io-client
```

### `AdminPanel.jsx`

```jsx
import React, { useEffect, useState } from "react";
import io from "socket.io-client";

const socket = io("http://localhost:5000");

export default function AdminPanel() {
  const [frames, setFrames] = useState({});
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    socket.emit("register", "admin");

    socket.on("cam-frame", ({ camId, image }) => {
      setFrames(prev => ({ ...prev, [camId]: "data:image/jpeg;base64," + image }));
    });

    socket.on("selected-camera", (camId) => setSelected(camId));

    return () => {
      socket.disconnect();
    };
  }, []);

  const handleSelect = (camId) => {
    socket.emit("select-camera", camId);
    setSelected(camId);
  };

  const camIds = [0,1,2,3];

  return (
    <div>
      <h2>Admin Panel</h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 10 }}>
        {camIds.map((id) => (
          <div key={id} style={{ border: selected === id ? "3px solid green" : "1px solid gray" }}>
            {frames[id] ? (
              <img src={frames[id]} alt={`cam-${id}`} style={{ width: "100%", height: 200 }} />
            ) : <p>Waiting...</p>}
            <button onClick={() => handleSelect(id)}>Select</button>
          </div>
        ))}
      </div>
    </div>
  );
}
```

---

## 🔹 Step–4: React Viewer UI

### `Viewer.jsx`

```jsx
import React, { useEffect, useState } from "react";
import io from "socket.io-client";

const socket = io("http://localhost:5000");

export default function Viewer() {
  const [frame, setFrame] = useState(null);

  useEffect(() => {
    socket.emit("register", "viewer");

    socket.on("best-frame", ({ image }) => {
      setFrame("data:image/jpeg;base64," + image);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <div>
      <h2>Viewer</h2>
      <div style={{ width: 640, height: 360, background: "#000" }}>
        {frame ? <img src={frame} alt="best" style={{ width: "100%", height: "100%" }} /> : <p style={{ color: "#fff" }}>Waiting...</p>}
      </div>
    </div>
  );
}
```

---

## ⚡ Workflow Recap

```
4 IP Cameras (RTSP) → ffmpeg (Windows exe) → Node.js (Express + Socket.io)
     → Admin React (4 preview + select) → Viewer React (selected cam only)
```

---

👉 এখন বলো, তুমি কি চাইছো আমি এর সাথে **ready-to-run repo structure (folders + package.json setup)** লিখে দিই, নাকি শুধু এই কোড গুলো দিয়েই তুমি শুরু করবে?
