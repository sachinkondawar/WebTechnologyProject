# Smriti Cognitive Platform

![MERN Stack](https://img.shields.io/badge/Stack-MERN-blue) ![React](https://img.shields.io/badge/Frontend-React.js-cyan) ![Node](https://img.shields.io/badge/Backend-Node.js-green) ![AI Integration](https://img.shields.io/badge/AI-Google_Generative_AI-orange)

**Smriti Cognitive Platform** is a modern, comprehensive web application designed to administer and evaluate cognitive assessments. It leverages a clean, clinical "light glassmorphism" aesthetic with a teal and slate color palette. The platform combines traditional neuropsychological tests with advanced AI evaluation capabilities to analyze user performance comprehensively.

## 🔗 Live Links (Demos)

> 💡 **Note to Developer:** Please replace these placeholders with your actual deployment URLs once you have hosted your frontend (e.g., on Vercel/Netlify) and backend (e.g., on Render/Railway/Heroku).

- **Live Application Demo:** [Insert Frontend URL Here - e.g., https://smriti-cognitive.vercel.app]
- **API Base URL:** [Insert Backend URL Here - e.g., https://api-smriti-cognitive.onrender.com]

---

## ✨ Key Features

### 🧠 Cognitive Assessment Suite
The platform includes an array of built-in interactive assessments targeting different cognitive domains:
- **Audio Dictation:** Tests auditory processing and working memory.
- **Digit Span Task:** Evaluates short-term verbal memory by recalling numeric sequences.
- **Drawing Canvas:** Assesses visuospatial and constructional abilities.
- **Pattern Memory:** Tests spatial memory and sequence recall.
- **Stroop Task:** Measures selective attention, cognitive flexibility, and processing speed.
- **Visual Naming:** Evaluates expressive language and semantic memory.

### 🤖 AI-Powered Evaluation
- **Google Generative AI Integration:** Results from the cognitive tests are aggregated—and even directly evaluated—using Google Gemini, providing an intelligent analysis of user responses.
  
### 🔐 Secure Authentication & Access Control
- **JWT-Based Authentication:** Complete login and signup functionality with encrypted passwords (bcrypt).
- **Admin Station Controls:** Strictly maintained administrative privileges where admins can only access and manage information specific to their own test stations.

### 🎨 Beautiful "Light Glassmorphism" UI
- Built with **Tailwind CSS**.
- A clinical, professional, and accessible design focused on a "Teal and Slate" color architecture.
- Modern visual hints with dynamic backgrounds (`NeuralBackground` component).

---

## 🛠️ Technology Stack

### Frontend (Client)
- **React.js 18** - UI Library
- **Vite** - Build Tool & Development Server
- **Tailwind CSS & PostCSS** - Utility-first styling & styling ecosystem
- **React Router DOM v7** - Declarative routing
- **Lucide React** - Modern, consistent iconography
- **Google Generative AI SDK** - For client-side AI analysis and inferences

### Backend (Server)
- **Node.js runtime** - JavaScript engine
- **Express.js** - Web Framework
- **MongoDB Atlas & Mongoose** - NoSQL Database and Relational Object Modeling
- **JSON Web Tokens (JWT) & bcryptjs** - Authentication & Security
- **dotenv & cors** - Environment variable management and Cross-Origin routing

---

## 🚀 Getting Started Locally

Follow these instructions to set up the project on your local machine.

### Prerequisites
- [Node.js](https://nodejs.org/en/) (v16.14.0 or newer)
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) Account (or local MongoDB server)
- Google Gemini API Key

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/remote-repo-name.git
cd "smriti project cognitive platform"
```

### 2. Environment Variables
You need to set up environment credentials for both the Frontend and Backend.

**Backend (`backend/.env`):**
Create a `.env` file in the `/backend` directory:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
# Other environment variables as needed
```

**Frontend (`frontend/.env`):**
Create a `.env` file in the `/frontend` directory:
```env
VITE_GEMINI_API_KEY=your_google_generative_ai_key
VITE_API_BASE_URL=http://localhost:5000/api
```

### 3. Installation
You can install dependencies for both sides manually or via a single command from the project root if concurrently is configured properly.

To install everything manually:
```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 4. Running the Application (Development Mode)
From the root directory, you can run the following to start both frontend and backend concurrently:
```bash
npm run dev
```

Alternatively, run them separately:
- **Backend:** `cd backend && npm run dev`
- **Frontend:** `cd frontend && npm run dev`

The app should now be running. The frontend will typically be accessible on `http://localhost:5173`.

---

## 🗂️ Project Structure

```text
/
├── backend/                  # Express API Server
│   ├── controllers/          # Route logical controllers (authController, etc.)
│   ├── models/               # Mongoose DB schemas (User, etc.)
│   ├── routes/               # Express routing definitions
│   ├── server.js             # Main server entrypoint
│   └── package.json    
├── frontend/                 # Vite/React Frontend
│   ├── public/               # Static assets
│   ├── src/
│   │   ├── api/              # API fetch / Axios abstractions (auth.js)
│   │   ├── components/       # Reusable components & Cognitive Tests
│   │   ├── pages/            # View Pages (Login, TestEngine, etc.)
│   │   ├── App.jsx / Main    # App Root and Routing
│   │   └── index.css         # Global styles (Tailwind integration)
│   ├── vite.config.js        # Vite configurations
│   ├── tailwind.config.js    # Tailwind UI configs
│   └── package.json        
├── package.json              # Root package orchestrator
└── README.md
```

---

## 🤝 Contribution Guidelines
This project is currently maintained by the specific development team. If you wish to contribute, please fork the repository, create a descriptive branch, and open a pull request. Make sure to adhere to existing styles - specifically maintaining the "light glassmorphism" UI integrity on the frontend.
