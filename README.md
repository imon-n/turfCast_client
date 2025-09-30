
```
# TurfCast - BestFrame AI

Multi-camera **AI-powered best frame detection** system.  
Detects **sports ball** from multiple video feeds → picks the **best camera view** → streams it to users in real time.

---

## 📂 Project Structure
```

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

---

## 🚀 Quick Start

### 1️⃣ Run AI Service (Python + YOLOv8)
```bash
cd ai-service
pip install -r requirements.txt
python main.py
````

### 2️⃣ Run Backend (Node.js + Socket.IO)

```bash
cd backend
npm install
node server.js
```

### 3️⃣ Run Frontend (React Client)

```bash
cd frontend
npm install
npm run dev   # or npm start
```

Then open [http://localhost:5173](http://localhost:5173) (Vite) or [http://localhost:3000](http://localhost:3000) (CRA).

---

## 🔄 Data Flow

```
Cameras/Video → Python AI (YOLOv8) → Best Frame → Node.js Server → React Client
```

---

## 🛠️ Tech Stack

* **AI Service**: Python, OpenCV, Ultralytics YOLOv8, Socket.IO client
* **Backend**: Node.js, Express, Socket.IO
* **Frontend**: React, Socket.IO client

---

## 📌 Future Plans

* [ ] WebRTC integration for smooth streaming
* [ ] Cloud GPU deployment
* [ ] Booking system + analytics

---

````

---

## 📌 AI Service README.md (`ai-service/README.md`)
```markdown
# 🤖 AI Service (YOLOv8 + OpenCV)

This module runs YOLOv8 to detect **sports ball** from multiple camera/video feeds and selects the **best frame** (largest ball detected).  
The best frame is sent to the Node.js backend via **Socket.IO client**.

---

## ⚙️ Setup
```bash
cd ai-service
python -m venv venv
source venv/bin/activate    # (Windows: venv\Scripts\activate)
pip install -r requirements.txt
````

---

## 📦 requirements.txt

```
ultralytics
opencv-python
numpy
python-socketio[client]
```

---

## ▶️ Run

```bash
python main.py
```

---

## 📂 Files

* `main.py` – Main detection + Socket.IO client
* `weights/yolov8n.pt` – YOLO model
* `utils/coco.txt` – COCO labels
* `inference/videos/` – Sample input videos

---

````

---

## 📌 Backend README.md (`backend/README.md`)
```markdown
# 🌐 Backend (Node.js + Socket.IO)

Handles real-time communication between **Python AI Service** and **React frontend** using **Socket.IO**.

---

## ⚙️ Setup
```bash
cd backend
npm install
````

---

## ▶️ Run

```bash
node server.js
```

Server runs at: [http://localhost:5000](http://localhost:5000)

---

## 📂 Files

* `server.js` – Express + Socket.IO server
* `package.json` – Dependencies

---

## 🔄 Events

* **`bestFrame`** → Received from Python AI
* **`bestFrame`** → Broadcasted to React clients

---

````

---

## 📌 Frontend README.md (`frontend/README.md`)
```markdown
# 💻 Frontend (React Client)

React app that subscribes to **Socket.IO server** and displays the **best frame** in real time.

---

## ⚙️ Setup
```bash
cd frontend
npm install
npm run dev   # (Vite) 
# or 
npm start     # (CRA)
````

---

## 📂 Files

* `src/BestFrameViewer.jsx` – Main component to display live frame
* `package.json` – React + Socket.IO client dependencies

---

## 📸 Example Component

```jsx
import { useEffect, useState } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:5000");

export default function BestFrameViewer() {
  const [frame, setFrame] = useState("");

  useEffect(() => {
    socket.on("bestFrame", (data) => {
      setFrame("data:image/jpeg;base64," + data);
    });
  }, []);

  return (
    <div>
      <h2>🏆 Best Frame Live</h2>
      {frame && <img src={frame} alt="Best Frame" />}
    </div>
  );
}
```

---

```

---
