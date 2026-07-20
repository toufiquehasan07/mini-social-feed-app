# Social Feed

A full-stack social feed application consisting of two projects within this repository:

- **`backend/`** — REST API built with Express.js and MongoDB
- **`react-native-app/`** — Cross-platform mobile client built with Expo (React Native)

---

## Prerequisites

Before you begin, make sure the following are installed on your machine:

| Requirement | Notes |
|---|---|
| **Node.js** (v18 or later) | Required to run both the backend and the Expo client. [Download](https://nodejs.org/) |
| **npm** (v9 or later) | Installed automatically with Node.js |
| **MongoDB** | Required for the backend database. See setup below. |
| **Expo Go app** | Required on your physical device to run the mobile client. Available on [Google Play](https://play.google.com/store/apps/details?id=host.exp.exponent) and the [App Store](https://apps.apple.com/app/expo-go/id982107779) |
| **Git** | To clone the repository |

Verify your installations:

```bash
node -v
npm -v
```

---

## 1. Clone the Repository

```bash
git clone <repository-url>
cd <repository-folder>
```

The repository contains two project directories at the root: `backend/` and `react-native-app/`. Each must be set up and run independently.

---

## 2. Database Setup (MongoDB)

This project requires a running MongoDB instance.

### Install MongoDB (if not already installed)

- **macOS** (via Homebrew):
  ```bash
  brew tap mongodb/brew
  brew install mongodb-community
  brew services start mongodb-community
  ```
- **Windows / Linux**: Follow the official installation guide for your OS: [MongoDB Installation Docs](https://www.mongodb.com/docs/manual/administration/install-community/)

### Verify MongoDB is running

```bash
mongosh
```

If a MongoDB shell opens without errors, the service is running correctly.

> Alternatively, you can use a hosted instance (e.g., [MongoDB Atlas](https://www.mongodb.com/atlas)) and use its connection string in place of a local one.

### Option: Run MongoDB via Docker (recommended)

If you prefer not to install MongoDB locally, a `docker-compose.yml` is provided inside `backend/` that spins up **MongoDB** and **Mongo Express** (a web-based MongoDB admin UI) in containers.

**Requirements:** [Docker](https://www.docker.com/products/docker-desktop/) installed and running.

```bash
cd backend
docker compose up -d
```

This starts:
- **MongoDB** — accessible at the connection string defined in `docker-compose.yml`
- **Mongo Express** — a web UI to browse your database, typically available at `http://localhost:8082`

Make sure your `.env` file's MongoDB connection string matches the credentials/port defined in `docker-compose.yml`.

To stop the containers:
```bash
docker compose down
```

---

## 3. Backend Setup (`backend/`)

### 3.1 Navigate to the backend directory

```bash
cd backend
```

### 3.2 Configure environment variables

Copy the example environment file and fill in your own values:

```bash
cp .env.example .env
```

Open `.env` and update the values as needed (e.g., MongoDB connection string, port, JWT secret, etc.), based on the keys defined in `.env.example`.

### 3.3 Install dependencies

```bash
npm install
```

### 3.4 Run the backend server

```bash
npm start
```

By default, the server will start and connect to the MongoDB instance defined in your `.env` file. Confirm the terminal output shows a successful database connection and the port the server is listening on.

---

## 4. Client Setup (`react-native-app/`)

### 4.1 Navigate to the client directory

```bash
cd react-native-app
```

### 4.2 Install dependencies

```bash
npm install
```

### 4.3 Configure the backend connection

Locate the file where the backend API base URL is defined (e.g., `.env` or a config/constants file) and set it to point to your backend server.

> ⚠️ **Important — Use your machine's local network IP address, not `localhost`, `127.0.0.1`, or `0.0.0.0`.**
>
> Your mobile device runs on a separate network context (physical device or emulator) and cannot resolve `localhost` back to your development machine. You must use your machine's actual IP address on the local network.

**To find your IP address:**

- **macOS / Linux:**
  ```bash
  ifconfig
  ```
  Look for `inet` under your active network interface (typically `en0` on Mac or `wlan0` on Linux), and copy that IP address.

- **Windows:**
  ```bash
  ipconfig
  ```
  Look for the `IPv4 Address` under your active network adapter.

Example configuration:
```
API_BASE_URL=http://192.168.x.x:PORT
```

Replace `192.168.x.x` with your actual IP and `PORT` with the port your backend is running on.

> Both your development machine and mobile device must be connected to the **same Wi-Fi network** for this to work.

### 4.4 Start the Metro bundler

```bash
npm start
```

This launches the Expo development server and displays a QR code in your terminal.

### 4.5 Run the app on your device

1. Install the **Expo Go** app on your mobile device from the Play Store (Android) or App Store (iOS).
2. Open Expo Go and either:
   - **Scan the QR code** shown in your terminal, or
   - **Manually enter the connection URL/IP address** shown in the terminal.
3. The app will bundle and launch on your device.

---

## Quick Start Summary

```bash
# 1. Clone
git clone <repository-url>
cd <repository-folder>

# 2. Start MongoDB
brew services start mongodb-community   # macOS example, if installed locally
# OR, using Docker:
cd backend && docker compose up -d

# 3. Backend
cd backend
cp .env.example .env   # then edit values
npm install
npm start

# 4. Client (in a new terminal)
cd react-native-app
npm install
# update backend URL in config using your machine's IP (see section 4.3)
npm start
# scan QR with Expo Go app
```

---

## Troubleshooting

| Issue | Likely Cause |
|---|---|
| Mobile app can't reach the backend | Using `localhost`/`127.0.0.1` instead of your machine's IP, or devices on different networks |
| Backend fails to start | MongoDB not running, or incorrect connection string in `.env` |
| Metro bundler QR code doesn't connect | Firewall blocking the connection, or devices not on the same Wi-Fi network |
