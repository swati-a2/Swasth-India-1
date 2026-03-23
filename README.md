# 🌸 Swasth India

**A premium full-stack MERN healthcare platform** focused on women's health and maternal wellness in India.

[![Live Demo](https://img.shields.io/badge/Live-Vercel-black?logo=vercel)](https://swasth-india-1.vercel.app)
[![Backend](https://img.shields.io/badge/API-Render-46E3B7?logo=render)](https://swasth-india-api.onrender.com/api/health)
[![GitHub](https://img.shields.io/badge/Repo-GitHub-181717?logo=github)](https://github.com/swati-a2/Swasth-India-1)

---

## ✨ Features

| Section | Description |
|---|---|
| 🎬 **Hero** | Immersive 3D animated hero with React Three Fiber |
| 📊 **Metrics** | Animated data visualizations with React Move |
| 🌿 **Care Spectrum** | Full spectrum of women's health services |
| 💬 **Stories** | Dynamic member video testimonials |
| 🔍 **Care Match** | Filtered specialist directory with FLIP animations |
| 🧮 **ROI Calculator** | Live employer savings calculator with SVG chart |
| 📬 **Footer** | Lead gen form + smooth parallax reveal |

---

## 🗂️ Project Structure

```
swasth-india/
├── client/              # React + Vite frontend
│   ├── src/
│   │   ├── components/  # Hero, Metrics, CareSpectrum, Stories, CareMatch, Calculator, Footer
│   │   ├── App.jsx
│   │   └── index.css
│   └── package.json
├── server/              # Express + MongoDB backend
│   ├── routes/          # providers, metrics, calculator, leads
│   ├── models/
│   ├── index.js
│   └── package.json
├── vercel.json          # Vercel frontend deployment config
├── render.yaml          # Render backend deployment config
└── .gitignore
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- MongoDB (local or [MongoDB Atlas](https://cloud.mongodb.com))

### 1. Clone the repository
```bash
git clone https://github.com/swati-a2/Swasth-India-1.git
cd Swasth-India-1
```

### 2. Start the backend
```bash
cd server
npm install
# Create a .env file:
echo "MONGO_URI=mongodb://localhost:27017/swasth_india" > .env
echo "PORT=5001" >> .env
npm run dev
```

### 3. Start the frontend
```bash
cd client
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) 🎉

---

## 🌐 Deployment

### Frontend → [Vercel](https://vercel.com)
1. Go to [vercel.com](https://vercel.com) → **Add New Project**
2. Import `swati-a2/Swasth-India-1`
3. Set **Root Directory** → `client`
4. Add Environment Variable:
   - `VITE_API_BASE` = `https://swasth-india-api.onrender.com`
5. Click **Deploy**

### Backend → [Render](https://render.com)
1. Go to [render.com](https://render.com) → **New Web Service**
2. Import `swati-a2/Swasth-India-1`
3. Set **Root Directory** → `server`
4. **Build Command**: `npm install`
5. **Start Command**: `npm start`
6. Add Environment Variables:
   - `MONGO_URI` = your MongoDB Atlas connection string
   - `CLIENT_ORIGIN` = your Vercel URL (e.g. `https://swasth-india-1.vercel.app`)
7. Click **Deploy**

---

## 🛠️ Tech Stack

**Frontend**
- React 18 + Vite
- React Three Fiber (3D Hero)
- React Move (animations)
- Framer Motion (micro-interactions)
- Vanilla CSS

**Backend**
- Express.js
- MongoDB + Mongoose
- CORS, dotenv

---

## 📄 License

MIT © 2026 Swasth India Health Inc.