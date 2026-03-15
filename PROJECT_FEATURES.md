# Accident Reporting and Emergency Response System

## 1. Project Overview

This is a **full-stack web application** for reporting accidents, tracking victims and vehicles involved, and coordinating emergency responses between hospitals and emergency teams.

**Why it matters:** Instead of just writing SQL scripts in a file, this project embeds every major DBMS concept inside a working web application with a React frontend, Express.js backend, and MySQL database. A professor can watch ACID transactions, cascading deletes, JOIN queries, and constraint violations happen in real time through the browser.

**Tech Stack:**

| Layer         | Technology               |
|---------------|--------------------------|
| Frontend      | React 18 + Bootstrap 5   |
| Backend       | Node.js + Express.js     |
| Database      | MySQL 8 (via mysql2)     |
| HTTP Logger   | Morgan                   |
| Architecture  | REST API, MVC, 3-Tier    |

---

## 2. DBMS Concepts Demonstrated

### 2.1 ER Model to Relational Schema

Six entities are identified and mapped to six relational tables:

| Entity          | Table            | Role                                            |
|-----------------|------------------|--------------------------------------------------|
| Accident        | `Accident`       | Central entity; all others reference it          |
| Victim          | `Victim`         | People involved in an accident (many-to-one)     |
| Vehicle         | `Vehicle`        | Vehicles involved in an accident (many-to-one)   |
| Emergency Team  | `Emergency_Team` | Independent entity (teams exist on their own)    |
| Hospital        | `Hospital`       | Independent entity (hospitals exist on their own)|
| Response        | `Response`       | Associative/junction entity linking Accident, Team, Hospital (ternary relationship) |

**Relationships mapped to foreign keys:**

- `Victim.accident_id` --> `Accident.accident_id` (Many victims per accident)
- `Vehicle.accident_id` --> `Accident.accident_id` (Many vehicles per accident)
- `Response.accident_id` --> `Accident.accident_id`
- `Response.team_id` --> `Emergency_Team.team_id`
- `Response.hospital_id` --> `Hospital.hospital_id`

> The ER diagram is available in `er_diagram.drawio` and can be opened at [draw.io](https://app.diagrams.net/) or exported as PNG for reports.

---

### 2.2 Normalization (1NF, 2NF, 3NF)

**First Normal Form (1NF):**
- Every column holds atomic (indivisible) values. There are no repeating groups or arrays.
- For example, `Victim` stores one person per row; if an accident has 5 victims, there are 5 rows, not a comma-separated list.

**Second Normal Form (2NF):**
- All tables have a single-column primary key (`AUTO_INCREMENT`), so there are no composite keys and therefore no partial dependencies by definition.
- Every non-key attribute depends on the entire primary key.

**Third Normal Form (3NF):**
- No transitive dependencies. For example, `hospital_name` and `hospital_location` are stored in the `Hospital` table, not in `Response`. The `Response` table only stores `hospital_id` (a foreign key), not redundant hospital details.
- Each table stores exactly one entity type: accident details in `Accident`, victim details in `Victim`, etc.

---

### 2.3 DDL Commands

The entire schema is defined using DDL (Data Definition Language) in `database/schema.sql`.

**CREATE DATABASE and USE:**

```sql
-- File: database/schema.sql (Lines 12-13)
CREATE DATABASE IF NOT EXISTS EmergencyDB;
USE EmergencyDB;
```

**CREATE TABLE with constraints:**

```sql
-- File: database/schema.sql (Lines 20-27)
CREATE TABLE Accident (
    accident_id   INT PRIMARY KEY AUTO_INCREMENT,
    date          DATE         NOT NULL,
    time          TIME         NOT NULL,
    location      VARCHAR(150) NOT NULL,
    severity      VARCHAR(20)  DEFAULT 'Moderate'
        CHECK (severity IN ('Low', 'Moderate', 'High', 'Critical'))
);
```

```sql
-- File: database/schema.sql (Lines 35-45)
CREATE TABLE Victim (
    victim_id    INT PRIMARY KEY AUTO_INCREMENT,
    name         VARCHAR(100) NOT NULL,
    age          INT,
    gender       VARCHAR(10),
    contact      VARCHAR(15),
    accident_id  INT NOT NULL,
    FOREIGN KEY (accident_id) REFERENCES Accident(accident_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);
```

---

### 2.4 DML Commands

All four DML operations (INSERT, SELECT, UPDATE, DELETE) are used across the controllers.

**SELECT** -- Fetching all accidents:

```js
// File: backend/controllers/accidentController.js (Line 11)
const [rows] = await pool.query('SELECT * FROM Accident ORDER BY date DESC');
```

**INSERT** -- Adding a new accident:

```js
// File: backend/controllers/accidentController.js (Lines 23-26)
const [result] = await pool.query(
  'INSERT INTO Accident (date, time, location, severity) VALUES (?, ?, ?, ?)',
  [date, time, location, severity]
);
```

**UPDATE** -- Modifying severity during a transaction:

```js
// File: backend/controllers/demoController.js (Lines 36-39)
await connection.query(
  'UPDATE Accident SET severity = ? WHERE accident_id = 1',
  ['Critical']
);
```

**DELETE** -- Removing an accident (triggers CASCADE):

```js
// File: backend/controllers/accidentController.js (Line 38)
await pool.query('DELETE FROM Accident WHERE accident_id = ?', [id]);
```

---

### 2.5 Constraints

This project demonstrates **six types of constraints**:

#### PRIMARY KEY (all 6 tables)

Every table uses `INT PRIMARY KEY AUTO_INCREMENT` to guarantee entity integrity:

```sql
-- File: database/schema.sql (Line 21)
accident_id   INT PRIMARY KEY AUTO_INCREMENT,
```

#### FOREIGN KEY with ON DELETE CASCADE

When an accident is deleted, all related victims, vehicles, and responses are automatically removed:

```sql
-- File: database/schema.sql (Lines 42-44)
FOREIGN KEY (accident_id) REFERENCES Accident(accident_id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
```

#### UNIQUE (vehicle_number)

Prevents duplicate vehicle registrations:

```sql
-- File: database/schema.sql (Line 54)
vehicle_number  VARCHAR(20) UNIQUE NOT NULL,
```

The backend also handles this constraint violation gracefully:

```js
// File: backend/controllers/vehicleController.js (Lines 36-38)
if (err.code === 'ER_DUP_ENTRY') {
  return res.status(400).json({ error: 'Vehicle number already exists' });
}
```

#### CHECK (severity)

Only allows predefined severity levels:

```sql
-- File: database/schema.sql (Lines 25-26)
severity      VARCHAR(20)  DEFAULT 'Moderate'
    CHECK (severity IN ('Low', 'Moderate', 'High', 'Critical'))
```

#### NOT NULL

Critical fields like `date`, `time`, `location`, `name`, and all foreign keys are marked NOT NULL to prevent incomplete records.

#### DEFAULT

If no severity is specified, it defaults to `'Moderate'`:

```sql
-- File: database/schema.sql (Line 25)
severity      VARCHAR(20)  DEFAULT 'Moderate'
```

---

### 2.6 JOIN Operations

#### INNER JOIN (2-table) -- Victim with Accident Location

```js
// File: backend/controllers/victimController.js (Lines 13-17)
const [rows] = await pool.query(`
  SELECT v.*, a.location AS accident_location
  FROM Victim v
  INNER JOIN Accident a ON v.accident_id = a.accident_id
  ORDER BY v.victim_id DESC
`);
```

**What it does:** Fetches every victim along with the location of the accident they were involved in. This replaces the raw `accident_id` number with a human-readable location string for the frontend table.

#### Multi-Table JOIN (4-table) -- Full Response Details

```js
// File: backend/controllers/responseController.js (Lines 13-27)
const [rows] = await pool.query(`
  SELECT
    r.response_id,
    r.response_time,
    a.accident_id,
    a.location   AS accident_location,
    a.severity,
    t.team_name,
    h.hospital_name
  FROM Response r
  INNER JOIN Accident a       ON r.accident_id  = a.accident_id
  INNER JOIN Emergency_Team t ON r.team_id      = t.team_id
  INNER JOIN Hospital h       ON r.hospital_id  = h.hospital_id
  ORDER BY r.response_time DESC
`);
```

**What it does:** Joins four tables -- `Response`, `Accident`, `Emergency_Team`, and `Hospital` -- in a single query. Instead of showing raw IDs, the frontend displays the accident location, severity level, team name, and hospital name all in one row. This demonstrates the power of relational joins to reconstruct meaningful information from normalized tables.

---

### 2.7 Transaction Control

#### Live Transaction Demo (demoController.js)

The entire transaction lifecycle is demonstrated in a single API endpoint that returns step-by-step logs to the frontend:

```js
// File: backend/controllers/demoController.js (Lines 18-108)

const runTransactionDemo = async (req, res) => {
  const connection = await pool.getConnection();
  const logs = [];

  try {
    // Step 1: START TRANSACTION
    await connection.beginTransaction();
    logs.push('Step 1: START TRANSACTION - Auto-commit disabled');

    // Step 2: UPDATE (this change WILL be committed)
    await connection.query(
      'UPDATE Accident SET severity = ? WHERE accident_id = 1',
      ['Critical']
    );
    logs.push('Step 2: Updated accident #1 severity to Critical');

    // Step 3: Create SAVEPOINT
    await connection.query('SAVEPOINT before_victim_insert');
    logs.push('Step 3: SAVEPOINT created - "before_victim_insert"');

    // Step 4: INSERT a victim (this will be rolled back)
    await connection.query(
      'INSERT INTO Victim (name, age, gender, contact, accident_id) VALUES (?, ?, ?, ?, ?)',
      ['Demo Victim', 25, 'Male', '0000000000', 1]
    );
    logs.push('Step 4: Inserted "Demo Victim" (will be undone)');

    // Step 5: ROLLBACK TO SAVEPOINT (undo insert, keep update)
    await connection.query('ROLLBACK TO SAVEPOINT before_victim_insert');
    logs.push('Step 5: ROLLBACK TO SAVEPOINT - Victim insert undone');

    // Step 6: COMMIT (only severity update persists)
    await connection.commit();
    logs.push('Step 6: COMMIT - Only severity update is persisted');

    // Step 7: Row-level locking demo
    await connection.beginTransaction();
    const [locked] = await connection.query(
      'SELECT * FROM Accident WHERE accident_id = 1 FOR UPDATE'
    );
    logs.push('Step 7: Row-level lock acquired on accident #1 (FOR UPDATE)');

    // Step 8: Update and release lock
    await connection.query(
      'UPDATE Accident SET severity = ? WHERE accident_id = 1',
      ['High']
    );
    await connection.commit();
    logs.push('Step 8: Updated severity back to High and released lock (COMMIT)');

    res.json({ success: true, message: 'Transaction demo completed successfully', logs });

  } catch (err) {
    await connection.rollback();
    logs.push('ERROR: Transaction rolled back due to: ' + err.message);
    res.status(500).json({ success: false, logs, error: err.message });

  } finally {
    connection.release();  // Return connection to pool
  }
};
```

**Step-by-step explanation:**

| Step | SQL Equivalent                        | What Happens                                                    |
|------|---------------------------------------|-----------------------------------------------------------------|
| 1    | `START TRANSACTION`                   | Auto-commit is disabled; changes are buffered                   |
| 2    | `UPDATE ... SET severity = 'Critical'`| Severity changed in buffer (not yet on disk)                    |
| 3    | `SAVEPOINT before_victim_insert`      | Bookmark created; we can rollback to this point                 |
| 4    | `INSERT INTO Victim ...`              | New victim row added in buffer                                  |
| 5    | `ROLLBACK TO SAVEPOINT`               | Victim insert is undone; severity update is kept                |
| 6    | `COMMIT`                              | Severity update is written to disk permanently                  |
| 7    | `SELECT ... FOR UPDATE`               | Row-level exclusive lock acquired (concurrency control)         |
| 8    | `UPDATE` + `COMMIT`                   | Severity reset to High, lock released                           |

#### SQL-Only Transaction Demos (transactions.sql)

```sql
-- File: database/transactions.sql (Lines 18-36) -- DEMO 1: SAVEPOINT + partial ROLLBACK
START TRANSACTION;

UPDATE Accident SET severity = 'Critical' WHERE accident_id = 1;

SAVEPOINT before_victim_insert;

INSERT INTO Victim (name, age, gender, contact, accident_id)
VALUES ('Test Victim', 25, 'Male', '0000000000', 1);

ROLLBACK TO SAVEPOINT before_victim_insert;

COMMIT;
```

```sql
-- File: database/transactions.sql (Lines 48-59) -- DEMO 2: Row-Level Locking
START TRANSACTION;

SELECT * FROM Accident WHERE accident_id = 1 FOR UPDATE;

UPDATE Accident SET severity = 'High' WHERE accident_id = 1;

COMMIT;
```

```sql
-- File: database/transactions.sql (Lines 65-74) -- DEMO 3: Full ROLLBACK
START TRANSACTION;

DELETE FROM Response WHERE accident_id = 1;

ROLLBACK;
-- The response record is still intact.
```

#### ACID Properties Demonstrated

| Property      | How It Is Demonstrated                                                                  |
|---------------|------------------------------------------------------------------------------------------|
| **Atomicity**   | If any step fails, the `catch` block calls `connection.rollback()` to undo everything  |
| **Consistency** | CHECK constraints and FOREIGN KEYs ensure the DB never enters an invalid state         |
| **Isolation**   | `SELECT ... FOR UPDATE` locks rows so concurrent transactions must wait                |
| **Durability**  | After `COMMIT`, the severity update survives even if the server crashes                |

---

### 2.8 Concurrency Control

#### Row-Level Locking with SELECT ... FOR UPDATE

```js
// File: backend/controllers/demoController.js (Lines 78-80)
const [locked] = await connection.query(
  'SELECT * FROM Accident WHERE accident_id = 1 FOR UPDATE'
);
```

```sql
-- File: database/transactions.sql (Lines 50-52)
-- This locks the row with accident_id = 1
-- No other transaction can modify this row until we COMMIT or ROLLBACK
SELECT * FROM Accident WHERE accident_id = 1 FOR UPDATE;
```

**How it works:**

1. Transaction A executes `SELECT ... FOR UPDATE` on accident #1. MySQL places an **exclusive row-level lock** on that row.
2. If Transaction B tries to `SELECT ... FOR UPDATE` or `UPDATE` the same row, it will **block and wait** until Transaction A calls `COMMIT` or `ROLLBACK`.
3. This prevents **lost updates** (two transactions overwriting each other) and **dirty reads** (reading uncommitted data).
4. The lock is automatically released when the transaction ends.

This is more granular than a table-level lock -- other rows in the `Accident` table remain accessible to concurrent transactions.

---

### 2.9 Connection Pooling

```js
// File: backend/config/db.js (Lines 1-22)
const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
  host:     process.env.DB_HOST     || 'localhost',
  user:     process.env.DB_USER     || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME     || 'EmergencyDB',
  waitForConnections: true,
  connectionLimit: 10,       // Max simultaneous connections
  queueLimit: 0              // Unlimited waiting requests
});

module.exports = pool;
```

**Why pooling is better than creating new connections:**

| Aspect              | Single Connection              | Connection Pool                     |
|---------------------|--------------------------------|-------------------------------------|
| Startup cost        | New TCP handshake every query  | Connections reused from pool        |
| Concurrency         | One query at a time            | Up to 10 simultaneous queries       |
| Scalability         | Crashes under load             | Queues excess requests gracefully   |
| Resource usage      | Wasteful (connect/disconnect)  | Efficient (long-lived connections)  |

When a controller calls `pool.query(...)`, it borrows a connection, executes the query, and returns the connection to the pool. For transactions, `pool.getConnection()` is used to get a dedicated connection for manual control.

---

## 3. Architecture

### 3-Tier Architecture

```
+-------------------+        +-------------------+        +-------------------+
|   Presentation    |  HTTP  |   Application     |  SQL   |      Data         |
|   (React 18)      | -----> |   (Express.js)    | -----> |   (MySQL 8)       |
|                   | <----- |                   | <----- |                   |
| - Dashboard       |  JSON  | - Routes          | Query  | - EmergencyDB     |
| - Accident Page   |        | - Controllers     | Result | - 6 Tables        |
| - Victim Page     |        | - Config (db.js)  |        | - Constraints     |
| - Vehicle Page    |        |                   |        | - Transactions    |
| - Response Page   |        |                   |        |                   |
+-------------------+        +-------------------+        +-------------------+
```

### MVC Pattern in Backend

| Component   | Directory / File                 | Responsibility                           |
|-------------|----------------------------------|------------------------------------------|
| **Model**   | `config/db.js` + MySQL tables    | Database connection and schema           |
| **View**    | `frontend/src/components/*.jsx`  | UI rendering (React)                     |
| **Controller** | `controllers/*Controller.js`  | Business logic, query execution          |
| **Routes**  | `routes/*Routes.js`              | URL-to-controller mapping                |

### REST API Design

All endpoints follow REST conventions:
- `GET` for reading data
- `POST` for creating new records
- `DELETE` for removing records
- JSON request/response format
- Meaningful HTTP status codes (200, 201, 400, 500)

---

## 4. API Endpoints

| Method   | Path                         | Description                                              |
|----------|------------------------------|----------------------------------------------------------|
| `GET`    | `/`                          | Health check - confirms API is running                   |
| `GET`    | `/api/accidents`             | Fetch all accidents (ordered by date DESC)               |
| `POST`   | `/api/accidents`             | Report a new accident                                    |
| `DELETE` | `/api/accidents/:id`         | Delete an accident (CASCADE removes related records)     |
| `GET`    | `/api/victims`               | Fetch all victims with accident location (INNER JOIN)    |
| `POST`   | `/api/victims`               | Add a new victim linked to an accident                   |
| `DELETE` | `/api/victims/:id`           | Delete a victim                                          |
| `GET`    | `/api/vehicles`              | Fetch all vehicles with accident location (INNER JOIN)   |
| `POST`   | `/api/vehicles`              | Add a new vehicle (UNIQUE constraint on vehicle_number)  |
| `DELETE` | `/api/vehicles/:id`          | Delete a vehicle                                         |
| `GET`    | `/api/responses`             | Fetch all responses with full details (4-table JOIN)     |
| `GET`    | `/api/responses/dropdown`    | Fetch teams, hospitals, accidents for form dropdowns     |
| `POST`   | `/api/responses`             | Record a new emergency response                          |
| `DELETE` | `/api/responses/:id`         | Delete a response                                        |
| `POST`   | `/api/demo/transaction`      | Run live transaction + concurrency demo (returns logs)   |

---

## 5. What Makes This Project Unique / Better

### 5.1 Live Transaction Demo

Unlike most DBMS projects that only show SQL in a file, this project has a **"Run Transaction Demo" button** on the Dashboard that:
- Executes a real `START TRANSACTION` --> `SAVEPOINT` --> `ROLLBACK TO SAVEPOINT` --> `COMMIT` sequence on the live database
- Demonstrates `SELECT ... FOR UPDATE` row-level locking
- Returns step-by-step logs displayed in the browser

```jsx
// File: frontend/src/components/Dashboard.jsx (Lines 147-153)
<button
  className="btn btn-primary mb-3"
  onClick={handleDemo}
  disabled={demoRunning}
>
  {demoRunning ? 'Running...' : 'Run Transaction Demo'}
</button>
```

A student can click this button during a viva and explain each log line as it appears.

### 5.2 Cascading Deletes Demo

Deleting an accident automatically removes **all related** victims, vehicles, and responses thanks to `ON DELETE CASCADE`:

```sql
-- File: database/schema.sql (Lines 42-44)
FOREIGN KEY (accident_id) REFERENCES Accident(accident_id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
```

This demonstrates **referential integrity** in action. The frontend shows records disappearing from Victims, Vehicles, and Responses pages after an accident is deleted.

### 5.3 Constraint Validation

The application demonstrates constraints as **live validation**:

- **UNIQUE constraint** on `vehicle_number` -- try entering a duplicate and the backend returns `"Vehicle number already exists"`:
  ```js
  // File: backend/controllers/vehicleController.js (Lines 36-38)
  if (err.code === 'ER_DUP_ENTRY') {
    return res.status(400).json({ error: 'Vehicle number already exists' });
  }
  ```
- **CHECK constraint** on `severity` -- only `'Low'`, `'Moderate'`, `'High'`, `'Critical'` are accepted
- **Foreign key validation** -- trying to add a victim to a non-existent `accident_id` fails with a foreign key error

### 5.4 Multi-Table JOINs

The Response page demonstrates a **4-table INNER JOIN** (Response + Accident + Emergency_Team + Hospital) in a single query. Most student projects only show 2-table joins.

```sql
FROM Response r
INNER JOIN Accident a       ON r.accident_id  = a.accident_id
INNER JOIN Emergency_Team t ON r.team_id      = t.team_id
INNER JOIN Hospital h       ON r.hospital_id  = h.hospital_id
```

### 5.5 Real Connection Pooling

Uses `mysql2` connection pool with `connectionLimit: 10` instead of a single connection. This is the same pattern used in production Node.js applications.

```js
// File: backend/config/db.js (Lines 12-20)
const pool = mysql.createPool({
  host:     process.env.DB_HOST     || 'localhost',
  user:     process.env.DB_USER     || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME     || 'EmergencyDB',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});
```

### 5.6 Morgan Request Logger

Every HTTP request is automatically logged with method, URL, status code, and response time:

```js
// File: backend/server.js (Line 16)
app.use(morgan('dev'));   // Log all HTTP requests (method, url, status, time)
```

Example output:
```
GET /api/accidents 200 12.345 ms
POST /api/victims 201 8.123 ms
DELETE /api/accidents/5 200 15.678 ms
```

This is useful for debugging and demonstrating server-side monitoring during a viva.

### 5.7 ER Diagram (draw.io)

A professional ER diagram is included as `er_diagram.drawio`. It can be:
- Opened at [app.diagrams.net](https://app.diagrams.net/)
- Exported as PNG/PDF for the project report
- Shows all 6 entities, their attributes, primary keys, and relationships

### 5.8 Async/Await Pattern

All database operations use modern `async/await` syntax with proper `try/catch` error handling:

```js
// File: backend/controllers/accidentController.js (Lines 9-17)
const getAccidents = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM Accident ORDER BY date DESC');
    res.json(rows);
  } catch (err) {
    console.error('Error fetching accidents:', err.message);
    res.status(500).json({ error: 'Failed to fetch accidents' });
  }
};
```

This avoids callback hell and makes the code readable and maintainable.

### 5.9 Full-Stack Integration

This is not just SQL scripts -- it is a **working web application**:

```
React Frontend  --(axios)-->  Express Backend  --(mysql2)-->  MySQL Database
     |                              |                              |
 Dashboard.jsx            accidentController.js             EmergencyDB
 shows summary cards      processes HTTP requests           stores & queries data
 runs transaction demo    executes SQL via pool              enforces constraints
```

The React frontend communicates with the Express backend via REST APIs, which in turn queries MySQL. This demonstrates practical DBMS application development as it would be done in industry.

---

## 6. How to Demo During Viva

Follow these steps in order for a structured, impressive demonstration:

### Step 1: Dashboard Overview
Open the Dashboard. Show the **summary cards** (Total Accidents, Victims, Vehicles, Responses) and the **severity breakdown analytics** with progress bars.

### Step 2: Add an Accident (INSERT + DDL)
Go to the Accidents page. Add a new accident with date, time, location, and severity. Show it appearing in the table. **Explain:** This is an INSERT operation; the CHECK constraint only allows Low/Moderate/High/Critical severity.

### Step 3: Add a Victim (Foreign Key Demo)
Go to the Victims page. Add a victim linked to the accident you just created. **Explain:** The `accident_id` is a FOREIGN KEY -- the database ensures the referenced accident exists.

### Step 4: Duplicate Vehicle Number (UNIQUE Constraint)
Go to the Vehicles page. Add a vehicle. Then try adding another vehicle with the **same vehicle number**. Show the error message `"Vehicle number already exists"`. **Explain:** This is the UNIQUE constraint in action; the backend catches `ER_DUP_ENTRY`.

### Step 5: Response Page (Multi-Table JOIN)
Go to the Responses page. Show the table displaying accident location, severity, team name, and hospital name. **Explain:** This single page queries 4 tables using INNER JOINs -- the data comes from Response, Accident, Emergency_Team, and Hospital.

### Step 6: Transaction Demo (ACID + Concurrency)
Go back to the Dashboard. Click **"Run Transaction Demo"**. Walk through each log line:
1. `START TRANSACTION` -- atomicity begins
2. `UPDATE severity to Critical` -- change buffered
3. `SAVEPOINT created` -- bookmark for partial rollback
4. `INSERT victim` -- another change buffered
5. `ROLLBACK TO SAVEPOINT` -- victim insert undone, severity update kept
6. `COMMIT` -- only severity update persisted (durability)
7. `FOR UPDATE lock acquired` -- concurrency control
8. `Updated and released lock` -- lock released on commit

### Step 7: Cascading Delete (Referential Integrity)
Delete the accident you created in Step 2. Go to Victims, Vehicles, and Responses pages. Show that all related records were **automatically deleted**. **Explain:** `ON DELETE CASCADE` ensures referential integrity -- no orphan records.

### Step 8: Schema Walkthrough
Open `database/schema.sql`. Point out:
- 6 `CREATE TABLE` statements (DDL)
- PRIMARY KEY, FOREIGN KEY, UNIQUE, CHECK, NOT NULL, DEFAULT constraints
- `ON DELETE CASCADE` on all child tables

### Step 9: Transaction SQL
Open `database/transactions.sql`. Explain:
- Demo 1: `SAVEPOINT` + partial `ROLLBACK` (atomicity)
- Demo 2: `SELECT ... FOR UPDATE` (concurrency/isolation)
- Demo 3: Full `ROLLBACK` (atomicity -- nothing saved)

### Step 10: Server Logs
Show the terminal running the backend. Point out Morgan logs showing every HTTP request with method, URL, status code, and response time. **Explain:** This is server-side monitoring.

---

*This project demonstrates DDL, DML, constraints (PK, FK, UNIQUE, CHECK, NOT NULL, DEFAULT), normalization (1NF-3NF), JOINs (2-table and 4-table), transactions (START, SAVEPOINT, ROLLBACK, COMMIT), concurrency control (FOR UPDATE row locking), ACID properties, connection pooling, and full-stack integration -- all in a single working application.*
