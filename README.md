# WPR381_Project
## Project Overview

Smart Ticket is a full-stack web application developed to modernise and streamline event management processes.

The system allows users to:
- Browse and search for events
- Register and log into secure accounts
- Book tickets for events
- Submit enquiries through a contact system

Administrators are able to:
- Create, update, and delete events
- Manage event capacity and availability
- View booking analytics and user enquiries

---

# Technologies Used

## Backend
- Node.js
- Express.js

## Frontend
- EJS (Embedded JavaScript Templates)
- HTML5
- CSS3

## Database
- MongoDB
- Mongoose ODM

## Authentication & Security
- Express Session
- bcrypt
- Helmet
- CORS
- dotenv

## Development Tools
- Git & GitHub
- Nodemon
- Visual Studio Code
- MongoDB Compass

---

# Features

- User Registration & Login
- Role-Based Access Control (Admin/User)
- Event Management System
- Ticket Booking System
- Dashboard & Analytics
- Contact & Enquiry Management
- Secure Password Handling
- Responsive User Interface

---

# Team Members & Roles

| Team Member | Role |
|---|---|
| Tobie Jansen van Vuuren | Backend Developer |
| Refilwe Segele | Database Engineer |
| Aidan Smith | Frontend Developer |
| Zander De Groote | DevOps Engineer |
| Bernu du Plessis | Project Coordinator |

---

# Setup Instructions

## 1. Clone the Repository

```bash
git clone <repository-link>
```

## 2. Navigate into the Project Folder

```bash
cd project-folder
```

## 3. Install Dependencies

```bash
npm install
```

---

# Environment Variables

Create a `.env` file in the root directory and add:

```env
PORT=3000
MONGODB_URI=mongodb://127.0.0.1:27017/eventPlatform
SESSION_SECRET=my_super_secret_key
NODE_ENV=development
```

---

# Running the Application

## Development Mode

```bash
npm run dev
```

## Standard Mode

```bash
node server.js
```

---

# Required Dependencies

The project uses the following npm packages:

```bash
npm install express mongoose ejs dotenv express-session helmet cors bcrypt
```

Development dependency:

```bash
npm install --save-dev nodemon
```

---

# Accessing the Application

After running the server, open:

```text
http://localhost:3000
```
