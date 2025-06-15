# 🎮 Sapience Esports Cup – 

A full-featured web-based registration and management platform for hosting inter-school esports tournaments at The Sapience School, Vikasnagar. Developed for students of **Class 9 and above**, this system handles both **solo** and **team registrations**, with an **admin panel**, **customizable UI**, and dynamic game-specific ruleset.

---

## 📌 Features

- 🔔 **Live Blinking Banner** – Admin-editable announcement banner (e.g., “Registration Open”) with toggleable visibility, color, and animation.
- 📝 **Smart Registration Form**
  - Supports Solo and Team entries (up to 5 members/team)
  - Game selection: Free Fire, CODM, FC Mobile
  - Dynamic fields based on entry type
  - Payment confirmation input (manual)
- 📂 **Rules Section (Tabbed)**
  - General Rules, Game-Specific, Code of Conduct, and more
  - Modular and easily extendable
- 🔐 **Secure Admin Panel**
  - Login-protected dashboard
  - View, edit, delete, and export registrations
  - Filter by game, class, or type
  - Customize banner and alerts
- 📱 **Responsive Esports UI**
  - Dark mode theme
  - Optimized for mobile-first access
  - School branding & event identity

---

## ⚙️ Technologies Used

- **Frontend**: HTML5, CSS3, JavaScript (Vanilla/React)  
- **Backend**: Node.js / PHP (choose based on deployment)  
- **Database**: Firebase / MongoDB / MySQL (modular options)  
- **Auth**: Admin login with hashed password (bcrypt or Firebase Auth)  
- **Deployment**: Vercel / Netlify (Frontend) + Railway / Render / Firebase (Backend)  

---

## 📁 Project Structure

```bash
.
├── public/             # Static files and assets
├── src/
│   ├── components/     # UI modules (Banner, Form, Tabs)
│   ├── pages/          # Home, Register, Rules, Admin
│   └── utils/          # Form validation, DB interaction
├── server/             # Express / PHP backend
├── db/                 # Schemas or SQL setup
├── .env.example        # Environment variable template
├── README.md
└── package.json
