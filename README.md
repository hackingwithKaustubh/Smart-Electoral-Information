# 🗳️ Civora — Intelligent Electoral Assistance & Information Platform

An AI-powered platform that helps Indian citizens navigate the electoral process with confidence. Civora provides plain-language answers to questions about voter registration, eligibility, required documents, and more — backed by official Election Commission of India (ECI) sources.

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| **🤖 AI Assistant** | Conversational chatbot powered by Groq (LLaMA 3.3 70B) that answers electoral questions in plain language |
| **🧠 Smart Intent Detection** | Hybrid heuristic + LLM intent classification for accurate, predictable responses |
| **🌐 Multilingual Support** | Supports English and Hindi with automatic language detection (extensible to more) |
| **🎙️ Voice Interaction** | Ask questions via voice using built-in browser Speech APIs |
| **📚 Information Hub** | Curated electoral information — eligibility, registration, documents, updates — in one place |
| **💾 Save & Bookmark** | Save useful AI explanations for quick future reference |
| **💬 Conversation History** | Continue, rename, search, and manage past conversations |
| **🔗 Official Sources** | Every response cites real ECI sources — never invented URLs |
| **🔐 Secure Auth** | JWT-based sessions, bcrypt-hashed passwords, HTTP-only cookies, and role-based access |
| **🛡️ Admin Panel** | Admin dashboard for managing users, content, FAQs, and audit logs |
| **❓ FAQ System** | Frequently asked questions with curated, verified answers |

---

## 🏗️ Tech Stack

### Frontend (Client)
- **React 19** with Vite 8
- **React Router v7** for SPA navigation
- **Tailwind CSS v4** for styling
- **Axios** for API communication
- **Lucide React** for icons

### Backend (Server)
- **Express 5** (Node.js)
- **MongoDB** with Mongoose ODM
- **Groq SDK** — LLaMA 3.3 70B Versatile for AI responses
- **JWT** for authentication
- **Helmet + CORS + Rate Limiting** for security
- **Morgan** for HTTP logging

---

## 📁 Project Structure

```
├── client/                    # React frontend
│   ├── src/
│   │   ├── api/               # Axios client config
│   │   ├── assets/            # Static assets (images, SVGs)
│   │   ├── components/
│   │   │   ├── layout/        # AppLayout, Footer, Header, Logo
│   │   │   ├── routes/        # Auth guards (protected/guest routes)
│   │   │   └── ui/            # Reusable UI components (Skeleton, etc.)
│   │   ├── context/           # Auth, Language, Toast context providers
│   │   ├── hooks/             # Custom hooks (useSpeech)
│   │   └── pages/             # Route pages
│   │       ├── LandingPage    # Public landing with features & FAQs
│   │       ├── LoginPage      # User login
│   │       ├── RegisterPage   # User registration
│   │       ├── DashboardPage  # User dashboard
│   │       ├── ChatPage       # AI assistant chat interface
│   │       ├── InformationHub # Electoral info browsing
│   │       ├── FaqPage        # FAQs
│   │       └── SourcesPage    # Official sources list
│   └── vite.config.js
│
├── server/                    # Express backend
│   ├── src/
│   │   ├── config/            # DB connection, env config
│   │   ├── controllers/       # Route handlers
│   │   ├── middleware/        # Auth, validation, error handling
│   │   ├── models/            # Mongoose schemas
│   │   │   ├── User           # User accounts with roles
│   │   │   ├── Conversation   # Chat conversations
│   │   │   ├── Message        # Individual messages
│   │   │   ├── ElectoralInfo  # Curated information articles
│   │   │   ├── FAQ            # Frequently asked questions
│   │   │   ├── OfficialSource # Verified ECI sources
│   │   │   ├── SavedInfo      # User bookmarks
│   │   │   └── AuditLog       # Admin audit trail
│   │   ├── routes/            # API route definitions
│   │   ├── services/ai/       # AI engine
│   │   │   ├── aiService      # Core chat pipeline
│   │   │   ├── intentService  # Heuristic intent detection
│   │   │   ├── contextManager # Conversation context window
│   │   │   ├── promptService  # System/user prompt builder
│   │   │   └── responseValidator # Structured output validation
│   │   ├── seed/              # Database seeder
│   │   └── utils/             # AppError, asyncHandler, API response
│   └── package.json
│
├── .env.example               # Environment variable template
└── .gitignore
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** ≥ 18
- **MongoDB** (local or Atlas)
- **Groq API Key** — [Get one free at console.groq.com](https://console.groq.com)

### 1. Clone the Repository

```bash
git clone https://github.com/hackingwithKaustubh/Smart-Electoral-Information.git
cd Smart-Electoral-Information
```

### 2. Setup Environment Variables

```bash
cp .env.example server/.env
```

Edit `server/.env` and fill in:

```env
MONGODB_URI=mongodb://127.0.0.1:27017/civora
JWT_SECRET=your_long_random_secret_here
JWT_EXPIRES_IN=7d
GROQ_API_KEY=gsk_your_groq_api_key
CLIENT_URL=http://localhost:5173
PORT=5000
NODE_ENV=development
COOKIE_SECURE=false
ADMIN_EMAIL=admin@civora.app
ADMIN_PASSWORD=YourSecurePassword123
```

### 3. Install Dependencies

```bash
# Server dependencies
cd server && npm install

# Client dependencies
cd ../client && npm install
```

### 4. Seed the Database (Optional)

```bash
cd server && npm run seed
```

### 5. Run the Application

**Terminal 1 — Backend:**
```bash
cd server && npm run dev
```

**Terminal 2 — Frontend:**
```bash
cd client && npm run dev
```

Open **http://localhost:5173** in your browser. 🎉

---

## 🔌 API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/api/health` | — | Health check |
| `POST` | `/api/auth/register` | — | Register new user |
| `POST` | `/api/auth/login` | — | Login & get JWT |
| `GET` | `/api/users/me` | ✅ | Get current user profile |
| `PUT` | `/api/users/me` | ✅ | Update profile |
| `GET` | `/api/conversations` | ✅ | List user conversations |
| `POST` | `/api/conversations` | ✅ | Create new conversation |
| `POST` | `/api/ai/chat` | ✅ | Send message to AI assistant |
| `GET` | `/api/information` | — | Browse electoral information |
| `GET` | `/api/faqs` | — | List FAQs |
| `GET` | `/api/sources` | — | List official sources |
| `GET/POST` | `/api/saved` | ✅ | Manage saved information |
| `GET/PUT/DELETE` | `/api/admin/*` | 🔒 Admin | User & content management |

---

## 🧠 How the AI Works

1. **Language Detection** — Automatically detects Hindi (Devanagari script) or defaults to English
2. **Intent Classification** — Two-stage pipeline:
   - *Heuristic* keyword matching (fast, no API call)
   - *LLM fallback* when heuristic confidence < 72%
3. **Knowledge Retrieval** — Fetches relevant info, FAQs, and official sources from MongoDB based on detected intent
4. **Response Generation** — Builds a context-aware prompt with retrieved knowledge and sends to Groq (LLaMA 3.3 70B)
5. **Structured Output** — Validates and formats the response with title, sections, bullets, next steps, and source citations

---

## 📜 License

This project is open-source under the [MIT License](LICENSE).

---

<p align="center">Built with ❤️ for Indian Democracy</p>
