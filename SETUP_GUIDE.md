# Setup Guide — Accident Reporting and Emergency Response System

Hey! This guide will walk you through setting up and running this project from scratch. No prior experience needed — just follow along step by step.

---

## What You Need Before Starting

Download and install these before doing anything else:

- **Node.js** — [https://nodejs.org](https://nodejs.org) (pick the LTS version)
- **XAMPP** — [https://www.apachefriends.org](https://www.apachefriends.org) (gives us MySQL + phpMyAdmin)
- **VS Code** — [https://code.visualstudio.com](https://code.visualstudio.com) (code editor)
- **A browser** — Chrome is recommended, but anything modern works

---

## Step-by-Step Setup

### Step 1: Install XAMPP

1. Download XAMPP from the link above and run the installer.
2. Just keep clicking Next — the default path is `C:\xampp` and that works fine.
3. Once installed, open the **XAMPP Control Panel** (you can search for it in the Start menu).

### Step 2: Start MySQL

1. Open the **XAMPP Control Panel**.
2. Click the **"Start"** button next to **MySQL**.
3. If everything is good, it should turn **green** and show port **3306**.

Now you need to set up the database. Pick whichever option you're most comfortable with:

#### Option A: phpMyAdmin (GUI - Recommended for beginners)

This is the easiest way if you don't like typing commands.

1. In XAMPP Control Panel, also click **"Start"** next to **Apache** (phpMyAdmin needs Apache to run).
2. Click the **"Admin"** button next to MySQL, OR just open your browser and go to [http://localhost/phpmyadmin](http://localhost/phpmyadmin).
3. Click the **"Import"** tab at the top.
4. Click **"Choose File"** and select `E:\dbms\database\schema.sql` — then click **"Go"**.
5. Now do the same thing again: click **"Import"**, choose `E:\dbms\database\sample_data.sql`, and click **"Go"**.

Done! Your database is ready.

#### Option B: XAMPP Shell (Command Line)

If you want to use the terminal instead:

1. In XAMPP Control Panel, click the **"Shell"** button.
2. Type this and press Enter:
   ```
   mysql -u root
   ```
3. Then run:
   ```
   source E:/dbms/database/schema.sql;
   ```
4. Then run:
   ```
   source E:/dbms/database/sample_data.sql;
   ```

#### Option C: MySQL Workbench

If you already have MySQL Workbench or want a more advanced GUI:

1. Download it from [https://dev.mysql.com/downloads/workbench/](https://dev.mysql.com/downloads/workbench/)
2. Open it and create a connection to **localhost**, user **root**, no password.
3. Go to **File > Open SQL Script** and open `schema.sql` — run it.
4. Then do the same for `sample_data.sql`.

#### Option D: Using the setup script (easiest)

This is the lazy way (no shame, it's the best way):

1. Open a terminal in the project root folder (`E:\dbms`).
2. Run:
   ```
   node setup_db.js
   ```

That's it. The script handles everything for you.

### Step 3: Configure Backend

1. Open the file `backend/.env` in VS Code.
2. Make sure it looks like this:
   ```
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=
   DB_NAME=EmergencyDB
   PORT=5000
   ```
3. The password is **blank by default** in XAMPP. If you set a MySQL password at some point, put it after `DB_PASSWORD=`.

### Step 4: Install Dependencies

You need to install packages for both the backend and frontend. Open two terminals:

**Terminal 1 — Backend:**
```
cd E:\dbms\backend
npm install
```

**Terminal 2 — Frontend:**
```
cd E:\dbms\frontend
npm install
```

Wait for both to finish. This downloads all the libraries the project needs.

### Step 5: Start Backend

In a terminal:
```
cd E:\dbms\backend
node server.js
```

Or if you want auto-reload (restarts automatically when you change code):
```
npm run dev
```

You should see: **"Server running on http://localhost:5000"**

Keep this terminal open — don't close it.

### Step 6: Start Frontend

Open a **new/second terminal**:
```
cd E:\dbms\frontend
npm run dev
```

You should see Vite telling you it's ready on **http://localhost:5173**

Keep this terminal open too.

### Step 7: Open the App

Open your browser and go to:

**[http://localhost:5173](http://localhost:5173)**

You should see the Accident Reporting dashboard. You're all set!

---

## How to Use the Project

### Dashboard

- Shows **total counts** of accidents, victims, vehicles, and responses.
- Has a **severity breakdown** with progress bars so you can see the analytics.
- Lists **recent accidents** at a glance.
- There's a **"Run Transaction Demo"** button — click it to see DBMS transaction concepts in action. It shows step-by-step logs of `START TRANSACTION`, `SAVEPOINT`, `ROLLBACK`, `COMMIT`, and `FOR UPDATE`. Super useful for understanding how transactions work.

### Accidents Page

- Fill out the form: date, time, location, severity.
- Click **"Report Accident"** to add a new one.
- All accidents show up in the table below.
- The **Delete** button removes the accident AND all related victims, vehicles, and responses automatically — this is the **CASCADE** delete in action.

### Victims Page

- Pick which accident the victim belongs to from the **dropdown** (it shows accident ID + location).
- Fill in name, age, gender, contact info.
- The table shows each victim along with their accident location — this is a **JOIN query** happening behind the scenes.

### Vehicles Page

- Enter the **vehicle number** (this must be unique — it's a UNIQUE constraint demo).
- Select vehicle type and which accident it was involved in.
- If you try to enter a **duplicate vehicle number**, you'll get an error. That's not a bug — that's the constraint working as intended!

### Responses Page

- Select an accident, emergency team, and hospital from the dropdowns.
- Enter the response time.
- The table shows full details pulled from **4 different tables** — this is a **multi-JOIN query** in action.

---

## Common Bugs & Errors

### "ECONNREFUSED" or "Can't connect to MySQL"

MySQL is not running. Open XAMPP Control Panel and click **Start** next to MySQL. Make sure it turns green and shows port 3306.

### "Access denied for user 'root'"

Your MySQL has a password set. Open `backend/.env` and update:
```
DB_PASSWORD=yourpassword
```

### "Unknown database 'EmergencyDB'"

You forgot to run the SQL files. Go back to **Step 2** and import `schema.sql` using any of the options listed there.

### "ER_DUP_ENTRY" when adding a vehicle

The vehicle number you entered already exists in the database. Use a different number. This is actually the **UNIQUE constraint working correctly** — not a bug!

### Frontend shows "Network Error"

The backend server is not running. Start it with:
```
cd E:\dbms\backend
node server.js
```

### "Port 5000 already in use"

Something else is using port 5000. Two fixes:

1. Change `PORT` in `backend/.env` to `5001`.
2. Also update `frontend/src/services/api.js` — change the baseURL to `http://localhost:5001/api`.

### "Port 3306 already in use"

Another MySQL instance is already running on your machine. Either stop that instance, or change the MySQL port in XAMPP settings.

### "Module not found" error

You probably forgot to install dependencies. Run `npm install` in whichever folder is complaining (backend or frontend).

### phpMyAdmin shows a blank page

Apache is not running. Go to XAMPP Control Panel and click **Start** next to Apache. phpMyAdmin needs Apache to work.

### "FOREIGN KEY constraint fails" when inserting

You're trying to reference a record that doesn't exist yet. For example, you can't add a Victim to Accident #5 if Accident #5 doesn't exist. Always create the **parent record first** (Accident before Victim, Team/Hospital before Response, etc.).

---

## Project Structure Quick Reference

```
E:\dbms\
├── backend\          --> Node.js + Express API server
│   ├── config\       --> Database connection
│   ├── controllers\  --> Business logic for each entity
│   ├── routes\       --> API endpoint definitions
│   ├── server.js     --> Main entry point
│   └── .env          --> Database credentials
├── frontend\         --> React + Vite UI
│   └── src\
│       ├── components\ --> Navbar, Dashboard, Forms
│       ├── pages\      --> Accidents, Victims, Vehicles, Responses
│       └── services\   --> API calls (axios)
├── database\         --> SQL files
│   ├── schema.sql    --> CREATE tables
│   ├── sample_data.sql --> INSERT sample records
│   ├── transactions.sql --> Transaction demos
│   └── er_diagram.drawio --> ER diagram (open in draw.io)
├── setup_db.js       --> Quick database setup script
└── README.md         --> Project overview
```

---

## Quick Start (TL;DR)

If you just want to get it running fast:

1. Start **MySQL** in XAMPP.
2. Run: `node setup_db.js`
3. **Terminal 1:** `cd backend && node server.js`
4. **Terminal 2:** `cd frontend && npm run dev`
5. Open [http://localhost:5173](http://localhost:5173)

That's it. You're good to go!
