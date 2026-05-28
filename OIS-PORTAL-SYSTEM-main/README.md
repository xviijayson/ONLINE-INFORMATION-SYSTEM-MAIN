# 🏛️ Office Information System (OIS Portal)
> Built with HTML · CSS · JavaScript · Firebase

---

## 📁 Project Structure

```
office-is/
├── index.html                  ← Login page
├── css/
│   └── style.css               ← Global styles
├── js/
│   ├── firebase-config.js      ← ⚠️ YOUR FIREBASE CONFIG HERE
│   └── utils.js                ← Shared utilities
└── pages/
    ├── admin-dashboard.html    ← Admin panel
    └── user-dashboard.html     ← User panel
```

---

## 🚀 Setup Instructions

### Step 1 — Create a Firebase Project
1. Go to [https://console.firebase.google.com](https://console.firebase.google.com)
2. Click **"Add project"** → Give it a name (e.g. `ois-portal`)
3. Disable Google Analytics (optional) → Click **Create Project**

### Step 2 — Enable Firebase Authentication
1. In your Firebase project, go to **Build → Authentication**
2. Click **Get Started**
3. Under **Sign-in method**, enable **Email/Password**

### Step 3 — Create Firestore Database
1. Go to **Build → Firestore Database**
2. Click **Create Database**
3. Choose **Start in test mode** (for development)
4. Select your preferred region → Click **Done**

### Step 4 — Set Firestore Security Rules
In Firestore → Rules tab, paste:
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == "admin";
    }
    match /clients/{clientId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
      allow update, delete: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == "admin";
    }
  }
}
```

### Step 5 — Get Firebase Config
1. In Firebase Console → Project Settings (⚙️ gear icon)
2. Under **"Your apps"**, click **"</> Web"**
3. Register your app → Copy the config object
4. Open `js/firebase-config.js` and paste your values:

```js
export const firebaseConfig = {
  apiKey:            "YOUR_API_KEY",
  authDomain:        "your-project.firebaseapp.com",
  projectId:         "your-project",
  storageBucket:     "your-project.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId:             "YOUR_APP_ID"
};
```

### Step 6 — Create First Admin Account
Since there's no admin yet, manually create one:
1. In Firebase Console → **Authentication → Users → Add User**
   - Enter email & password
   - Copy the generated **User UID**
2. In **Firestore → clients collection**, add a new document:
   - **Document ID**: paste the UID
   - Add fields:
     - `displayName` (string): `"Administrator"`
     - `email` (string): your admin email
     - `role` (string): `"admin"`
     - `createdAt` (timestamp): now

### Step 7 — Run the Project
Open `index.html` in a browser. For local development, use **Live Server** (VS Code extension) or any local HTTP server:
```bash
# Using Python
python -m http.server 8080

# Using Node.js
npx serve .
```
Then visit: `http://localhost:8080`

### Step 8 - Deploy to Vercel
This project is configured for Vercel as a static site.

Use these Vercel settings:
- Framework Preset: `Other`
- Build Command: `npm run build`
- Output Directory: `dist`
- Install Command: default

The `npm run build` command copies the HTML, CSS, JS, images, and data files into `dist/`, and Vercel serves `dist/index.html` as the homepage.

If you use Vercel drag-and-drop instead of Git import, upload the contents of `dist/` directly. Do not upload a parent folder that contains the project folder, because Vercel needs `index.html` at the deployed root.

---

## ✅ Features Summary

### Admin Panel
- 🔐 Login / Logout
- 📊 Dashboard with charts (assistance types, barangays, sex, civil status)
- 👥 Client Records — Add, Edit, Delete, View, Search
- 🪪 Auto-generated Client ID (e.g. `2026-04-0001`)
- ⬇️ Export to Excel
- 🔑 Manage Accounts — Create admin or user accounts

### User Panel
- 🔐 Login / Logout
- 👥 View all client records (read-only)
- ➕ Add new clients (no edit/delete)
- 🔍 Search by name, ID, barangay

---

## 🛠️ Tech Stack
| Layer      | Technology                        |
|------------|-----------------------------------|
| Frontend   | HTML5, CSS3, Vanilla JavaScript   |
| Auth       | Firebase Authentication           |
| Database   | Cloud Firestore (Firebase)        |
| Charts     | Chart.js                          |
| Excel Export | SheetJS (XLSX)                  |
| Fonts      | Google Fonts (Syne + DM Sans)     |

---

## 📞 Support
For issues, check the browser console (F12) for error messages.
Most errors will be Firebase configuration or security rules related.
