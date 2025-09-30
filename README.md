
# 🏟️ TurfCast - BestFrame AI (Final `README.md`)

```markdown
# 🏟️ TurfCast - BestFrame AI

Multi-camera **AI-powered best frame detection** system.  
It detects **sports ball** from multiple video feeds → selects the **best camera view** → streams it to users in real time.

```
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

### 1️⃣ Run AI Service (Python + YOLOv8)
### 🚀 Quick Start
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
npm run dev   # (Vite) 
```

Then open:

* [http://localhost:5173](http://localhost:5173) (Vite)

---

## 🔄 Data Flow

```
Cameras/Video → Python AI (YOLOv8) → Best Frame → Node.js Server → React Client
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
* [ ] Booking system + analytics

