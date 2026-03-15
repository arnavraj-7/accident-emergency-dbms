# Accident Reporting and Emergency Response System

A full-stack DBMS academic project demonstrating database design, SQL transactions, concurrency control, and CRUD operations through a web interface.

## Tech Stack

| Layer    | Technology             |
|----------|------------------------|
| Frontend | React 18, Vite, Bootstrap 5 |
| Backend  | Node.js, Express.js    |
| Database | MySQL                  |
| Driver   | mysql2 (with Promises) |

## Quick Start (Clone & Run)

### Prerequisites
- [Node.js](https://nodejs.org) (v18+)
- [XAMPP](https://www.apachefriends.org) or MySQL Server

### 1. Clone & Install
```bash
git clone <repo-url>
cd dbms

cd backend && npm install && cd ..
cd frontend && npm install && cd ..
```

### 2. Setup Database
Start MySQL in XAMPP, then:
```bash
cp backend/.env.example backend/.env
# Edit backend/.env if your MySQL has a password

node setup_db.js
```

### 3. Run
Open two terminals:

```bash
# Terminal 1 - Backend
cd backend && node server.js

# Terminal 2 - Frontend
cd frontend && npm run dev
```

### 4. Open
Go to http://localhost:5173

## Database Schema (ER Model to Relational Schema)

```
Accident (accident_id PK, date, time, location, severity)
    |
    |--< Victim (victim_id PK, name, age, gender, contact, accident_id FK)
    |
    |--< Vehicle (vehicle_id PK, vehicle_number UNIQUE, vehicle_type, accident_id FK)
    |
    +--< Response (response_id PK, response_time, accident_id FK, team_id FK, hospital_id FK)
              |                                         |                    |
              +-- Emergency_Team (team_id PK, ...)      +-- Hospital (hospital_id PK, ...)
```

### Normalization
- **1NF**: All attributes are atomic, no repeating groups
- **2NF**: No partial dependencies (all non-key attributes depend on the full primary key)
- **3NF**: No transitive dependencies (non-key attributes don't depend on other non-key attributes)

## DBMS Concepts Demonstrated

| Concept              | Where                                      |
|----------------------|--------------------------------------------|
| ER Diagram           | `database/er_diagram.drawio`               |
| DDL (CREATE TABLE)   | `database/schema.sql`                      |
| DML (INSERT/SELECT)  | `database/sample_data.sql`, controllers    |
| Foreign Keys         | `schema.sql` - ON DELETE CASCADE           |
| UNIQUE Constraint    | Vehicle.vehicle_number                     |
| CHECK Constraint     | Accident.severity                          |
| JOINs                | Victim, Vehicle, Response controllers      |
| Transactions         | `database/transactions.sql`, demoController|
| SAVEPOINT / ROLLBACK | Transaction demo API                       |
| Concurrency Control  | FOR UPDATE (row-level locking)             |
| Connection Pooling   | `backend/config/db.js`                     |

## API Endpoints

| Method | Endpoint               | Description                  |
|--------|------------------------|------------------------------|
| GET    | /api/accidents         | Get all accidents            |
| POST   | /api/accidents         | Report a new accident        |
| DELETE | /api/accidents/:id     | Delete an accident           |
| GET    | /api/victims           | Get all victims (with JOIN)  |
| POST   | /api/victims           | Add a victim                 |
| DELETE | /api/victims/:id       | Delete a victim              |
| GET    | /api/vehicles          | Get all vehicles (with JOIN) |
| POST   | /api/vehicles          | Add a vehicle                |
| DELETE | /api/vehicles/:id      | Delete a vehicle             |
| GET    | /api/responses         | Get responses (multi-JOIN)   |
| GET    | /api/responses/dropdown| Get teams/hospitals/accidents|
| POST   | /api/responses         | Record a response            |
| DELETE | /api/responses/:id     | Delete a response            |
| POST   | /api/demo/transaction  | Run transaction demo         |

## Project Structure

```
root/
├── backend/
│   ├── config/db.js              # MySQL connection pool
│   ├── controllers/              # Business logic
│   │   ├── accidentController.js
│   │   ├── victimController.js
│   │   ├── vehicleController.js
│   │   ├── responseController.js
│   │   └── demoController.js     # Transaction demo
│   ├── routes/                   # API route definitions
│   ├── server.js                 # Express entry point
│   └── .env.example              # Environment config template
├── frontend/
│   └── src/
│       ├── components/           # Reusable UI components
│       ├── pages/                # Page-level components
│       ├── services/api.js       # Axios API calls
│       ├── App.jsx               # Router setup
│       └── main.jsx              # Entry point
├── database/
│   ├── schema.sql                # DDL - table definitions
│   ├── sample_data.sql           # DML - test data
│   ├── transactions.sql          # Transaction demos
│   └── er_diagram.drawio         # ER diagram (open in draw.io)
├── setup_db.js                   # One-command database setup
└── README.md
```

## Screenshots

> Add screenshots of Dashboard, Accidents page, Transaction demo here.

## License

Academic project - for educational purposes only.
