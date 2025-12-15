
# TurfCast BD

TurfCast is an **AI-powered multi-camera sports streaming system**. It automatically detects the ball, picks the **best viewing angle**, and streams it live to audiences.

---
cam2-2025 | Stellar11
---

## 📌 Features
- 🔴 **Live Streaming (Facebook / YouTube)**
- 🎯 **Best Frame Highlight** 
- 📹 **Recorded Match Playback** 
- 📅 **Slot Booking System** → (online scheduling + payment)
- 🌐 **Cross-Platform Access** → Web app (React frontend) + scalable Node.js backend।  

---
## 📂 Project Structure
```bash
turf-bestframe-ai/
│
├── ai-service/             # Python (YOLOv8)
│   ├── main.py
│   ├── requirements.txt
│   ├── weights/
│   │   └── yolov8n.pt
│   ├── utils/
│   │   └── coco.txt
│   ├── inference/videos/
│   │   ├── 0t1.mp4
│   │   └── 0t2.mp4
│   └── README.md
│
├── backend/                # Node.js (Express + Socket.io)
│   ├── server.js
│   ├── package.json
│   └── README.md
│
├── frontend/               # React Client
│   ├── src/BestFrameViewer.jsx
│   ├── package.json
│   └── README.md
│
└── README.md               # Main repo instructions
````


## 🚀 Quick Start

### Run AI Service (Python + YOLOv8)
```bash
cd ai-service
pip install -r requirements.txt
python main.py
````

### Run Backend (Node.js + Socket.IO)

```bash
cd backend
npm install
node server.js
```

### Run Frontend (React Client)

```bash
cd frontend
npm install
npm run dev   # (Vite) 
```

Then open:

* [http://localhost:5173](http://localhost:5173) (Vite)

---

## 🔄 Data Flow

```
Cameras/Videos → AI (YOLOv8) → Best Frame → Node.js Server → React Client
```

---

## 🛠️ Tech Stack

* **AI Service** → Python, OpenCV, Ultralytics YOLOv8, Socket.IO client
* **Backend** → Node.js, Express, Socket.IO
* **Frontend** → React, Socket.IO client

---

## 📌 Future Plans

* [ ] WebRTC integration for smooth streaming
* [ ] Cloud GPU deployment
* [ ] Analytics Dashboard




