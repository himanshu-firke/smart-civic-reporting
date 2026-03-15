# 🏙️ Crowdsourced Civic Issue Reporting and Resolution System

A web-based platform that enables citizens to report civic issues (potholes, garbage overflow, water leakage, etc.) and allows municipal authorities to manage and resolve them efficiently through automated worker assignment.

---

## 📌 Problem Statement

Citizens lack a centralized, transparent system to report civic problems. Complaints are manually assigned, leading to delays, duplicate efforts, and no accountability in resolution.

---

## 💡 Solution

This system automates the entire lifecycle of civic complaints — from reporting to resolution:

- Citizens report issues with **photo, description, and auto-captured GPS location**
- System **automatically assigns** the complaint to the **nearest worker** within a 5km service radius
- Workers resolve issues and upload **completion proof**
- Citizens receive **real-time status updates** throughout the process

---

## 👥 User Roles

| Role | Capabilities |
|------|-------------|
| **Citizen** | Report issues, track complaint status, receive notifications |
| **Worker** | View assigned tasks, update status, upload resolution proof |
| **Department Admin** | Manage department complaints, register workers, verify resolution |
| **Super Admin** | Oversee all departments, manage users, view analytics, generate reports |

---

## ⚙️ Key Features

- 📸 Issue reporting with image upload and description
- 📍 Automatic GPS location capture
- 🤖 Auto-assignment of issues to nearest department worker
- 🔄 Real-time status tracking (`Submitted → Assigned → In Progress → Resolved → Closed`)
- 📊 Role-based dashboards for all user types
- ✅ Photo proof verification for issue resolution
- 🗺️ Map integration for location visualization
- 🔔 Notification system for status updates

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React.js |
| Backend | Node.js, Express.js |
| Database | MongoDB |
| Authentication | JWT (JSON Web Token) |
| Map Integration | Leaflet / OpenStreetMap |
| Image Storage | Cloudinary |

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v16+)
- MongoDB
- Cloudinary account

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/civic-issue-reporting.git
   cd civic-issue-reporting
   ```

2. **Install backend dependencies**
   ```bash
   cd server
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd client
   npm install
   ```

4. **Set up environment variables**

   Create a `.env` file in the `server` directory:
   ```env
   PORT=5000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   ```

5. **Run the application**
   ```bash
   # Start backend
   cd server
   npm run dev

   # Start frontend (in a new terminal)
   cd client
   npm start
   ```

6. Open `http://localhost:3000` in your browser.

---

## 📂 Project Structure

```
civic/
├── client/              # React.js frontend
│   ├── public/
│   └── src/
│       ├── components/
│       ├── pages/
│       └── ...
├── server/              # Node.js + Express backend
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   └── ...
├── .env
├── README.md

```

---

## 🔄 Issue Status Flow

```
Submitted → Assigned to Worker → In Progress → Resolved → Closed
```

---

## 👨‍💻 Team Members

| # | Name |
|---|------|
| 1 | **Himanshu Firke** |
| 2 | **Shivraj Yadav** |
| 3 | **Kandarp Patil** |
| 4 | **Shivprasad Dongapure** |

---

> Built with ❤️ for smarter cities and better civic engagement.
