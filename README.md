# nodejs-cicd-app (BOOM.COM E-Commerce)

A clean, modern Node.js and Express REST API & E-Commerce Web Application (**BOOM.COM**) designed specifically for practicing **DevOps & CI/CD workflows** with **GitHub Actions**, self-hosted runners, SonarQube, PM2, and Amazon Linux 2023.

---

## 📌 Technologies

- **Runtime:** Node.js (v20+)
- **Framework:** Express.js
- **Testing:** Jest & Supertest
- **Process Manager Compatibility:** PM2 / Systemd
- **Target OS:** Amazon Linux 2023 / Ubuntu / macOS / Windows

---

## ⚙️ Environment Variables

The application is configured using environment variables. An example template is provided in `.env.example`:

| Variable | Default Value | Description |
|---|---|---|
| `PORT` | `3000` | Port number the server listens on |
| `NODE_ENV` | `development` | Application environment (`development`, `production`, `test`) |

To use custom values, copy the template:
```bash
cp .env.example .env
```

---

## 🚀 Installation & Setup

1. **Clone the repository and install dependencies:**
   ```bash
   npm install
   ```

2. **Run the Application:**
   ```bash
   npm start
   ```
   The server will start at `http://localhost:3000`.

---

## 🧪 Testing & CI Build

The project uses **Jest** and **Supertest** for automated API tests:

- **Run unit & integration tests:**
  ```bash
  npm test
  ```

- **Run build step (CI validation):**
  ```bash
  npm run build
  ```

---

## 🌐 API Endpoints

| Method | Endpoint | Description | Sample Response Status |
|---|---|---|---|
| `GET` | `/` | Application info and environment status | `200 OK` |
| `GET` | `/health` | Health check endpoint for CI/CD, PM2, and load balancers | `200 OK` |
| `GET` | `/api/users` | Sample user records in JSON format | `200 OK` |

### Endpoint Details & Examples

#### 1. `GET /`
```json
{
  "application": "nodejs-cicd-app",
  "version": "1.0.0",
  "environment": "development",
  "message": "Welcome to Node.js CI/CD Practice API"
}
```

#### 2. `GET /health`
Used by GitHub Actions and deployment verification scripts (e.g., `curl -I http://localhost:3000/health`):
```json
{
  "status": "UP"
}
```

#### 3. `GET /api/users`
```json
[
  { "id": 1, "name": "DevOps Engineer", "email": "devops@example.com", "role": "Admin" },
  { "id": 2, "name": "Cloud Architect", "email": "cloud@example.com", "role": "User" },
  { "id": 3, "name": "CI/CD Specialist", "email": "cicd@example.com", "role": "User" }
]
```

---

## 🔄 DevOps & CI/CD Lifecycle Compatibility

This project is tailored to work out-of-the-box with standard CI/CD pipeline stages:

- **Dependency Installation:** `npm install` (or `npm ci` in CI environments)
- **Code Testing:** `npm test`
- **Build Verification:** `npm run build`
- **Process Management:** `pm2 start server.js --name nodejs-cicd-app`
- **Health Verification:** `curl -f http://localhost:3000/health || exit 1`

---

## 📁 Project Structure

```
nodejs-cicd-app/
├── src/
│   └── app.js             # Express application & route definitions
├── tests/
│   └── app.test.js        # Automated API test suite (Jest + Supertest)
├── .env                   # Local environment variables
├── .env.example           # Example environment template
├── .gitignore             # Git ignore rules
├── package.json           # Project metadata, scripts, and dependencies
├── README.md              # Project documentation
└── server.js              # Server entrypoint and port listener
```
