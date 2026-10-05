# ✈️ End-to-End Frequent Flyer Portal

A full-stack web application for managing frequent flyer members digitally, replacing manual paper/Excel workflows with a simple, reliable portal.

## 📸 Dashboard Preview

<img width="1895" height="982" alt="Screenshot 2026-10-05 191655" src="https://github.com/user-attachments/assets/56ef621e-43b4-4be9-9465-413c49bf4eaa" />


## 🚀 Features

* 👤 Add, view, search, and update members
* ✈️ Manage membership tiers and loyalty miles
* 🔍 Search by member ID, name, or email
* ✅ Client-side and server-side validation
* 🔐 XSS/script sanitization
* 🚫 Duplicate email protection
* ⚡ Loading and empty states
* 📡 Connection status indicator
* ♿ Accessibility-focused UI
* 📊 Action telemetry logging

## 🛠️ Tech Stack

**Frontend:** HTML, CSS, JavaScript
**Backend:** Node.js, Express.js
**Database:** MongoDB, Mongoose
**Testing:** Jest, Supertest
**Code Quality:** ESLint
**Tools:** Git, GitHub, VS Code

## 📂 Project Structure

```text
Frequent-Flyer-Portal/
├── docs/
│   └── dashboard.png
├── src/
│   ├── client/
│   ├── config/
│   ├── models/
│   ├── routes/
│   └── server.js
├── tests/
├── .env.example
├── eslint.config.js
├── PROMPTS.md
├── package.json
└── README.md
```

## ⚙️ Run Locally

### 1. Clone

```bash
git clone https://github.com/saakshigupta-saa/Frequent-Flyer-Portal.git
cd Frequent-Flyer-Portal
```

### 2. Install dependencies

```bash
npm install
```

### 3. Create `.env`

```env
MONGO_URI=your_mongodb_connection_string
PORT=5000
```

### 4. Start

```bash
npm run dev
```

Open:

```text
http://localhost:5000
```

## 🧪 Testing

Run tests:

```bash
npm test
```

Current result:

```text
5 tests passed
```

Run ESLint:

```bash
npm run lint
```

Current result:

```text
0 errors
0 warnings
```

## 🔗 API

| Method | Endpoint                             | Purpose       |
| ------ | ------------------------------------ | ------------- |
| GET    | `/api/health`                        | Health check  |
| GET    | `/api/frequent-flyers`               | Get members   |
| GET    | `/api/frequent-flyers/:id`           | Get member    |
| GET    | `/api/frequent-flyers/search/:query` | Search        |
| POST   | `/api/frequent-flyers`               | Create member |
| PUT    | `/api/frequent-flyers/:id`           | Update member |

## 🔐 Security

* Environment variables for database credentials
* XSS/script sanitization
* Server-side validation
* Duplicate email protection
* `.env` excluded from Git

## 👩‍💻 Author

**Sakshi Gupta**


[GitHub](https://github.com/saakshigupta-saa)
