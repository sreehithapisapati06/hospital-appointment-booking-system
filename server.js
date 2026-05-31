const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// ---------------- DATABASE CONNECTION ----------------
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "Yashvi@9274", 
    database: "HospitalDB"
});

db.connect((err) => {
    if (err) {
        console.log("❌ Database connection failed:", err);
    } else {
        console.log("✅ Connected to MySQL Database");
    }
});

// ---------------- ROUTES ----------------

// 1. Add Patient
app.post("/addPatient", (req, res) => {
    const { P_ID, Name, DOB, Gender, Mobile_No } = req.body;

    const sql = "INSERT INTO Patient VALUES (?, ?, ?, ?, ?)";

    db.query(sql, [P_ID, Name, DOB, Gender, Mobile_No], (err, result) => {
        if (err) {
            console.log(err);
            res.send("Error adding patient");
        } else {
            res.send("✅ Patient Added Successfully");
        }
    });
});

// 2. Add Doctor
app.post("/addDoctor", (req, res) => {
    const { D_ID, Name, Specialization, Mobile_No } = req.body;

    const sql = "INSERT INTO Doctor VALUES (?, ?, ?, ?)";

    db.query(sql, [D_ID, Name, Specialization, Mobile_No], (err, result) => {
        if (err) {
            console.log(err);
            res.send("Error adding doctor");
        } else {
            res.send("✅ Doctor Added Successfully");
        }
    });
});

// 3. Add Nurse
app.post("/addNurse", (req, res) => {
    const { N_ID, Name, Gender, Salary, Mobile_No } = req.body;

    const sql = "INSERT INTO Nurse VALUES (?, ?, ?, ?, ?)";

    db.query(sql, [N_ID, Name, Gender, Salary, Mobile_No], (err, result) => {
        if (err) {
            console.log(err);
            res.send("Error adding nurse");
        } else {
            res.send("✅ Nurse Added Successfully");
        }
    });
});

// 4. Book Appointment
app.post("/bookConsult", (req, res) => {
    const { P_ID, D_ID, Consult_Date } = req.body;

    const sql = "INSERT INTO Consults VALUES (?, ?, ?)";

    db.query(sql, [P_ID, D_ID, Consult_Date], (err, result) => {
        if (err) {
            console.log(err);
            res.send("❌ Error booking appointment (maybe duplicate)");
        } else {
            res.send("✅ Appointment Booked");
        }
    });
});

// 5. Get All Patients
app.get("/patients", (req, res) => {
    db.query("SELECT * FROM Patient", (err, result) => {
        if (err) {
            res.send(err);
        } else {
            res.json(result);
        }
    });
});

// 6. Get All Doctors
app.get("/doctors", (req, res) => {
    db.query("SELECT * FROM Doctor", (err, result) => {
        if (err) {
            res.send(err);
        } else {
            res.json(result);
        }
    });
});

// 7. Get All Appointments
app.get("/appointments", (req, res) => {
    const sql = `
        SELECT p.Name AS Patient, d.Name AS Doctor, c.Consult_Date
        FROM Consults c
        JOIN Patient p ON c.P_ID = p.P_ID
        JOIN Doctor d ON c.D_ID = d.D_ID
    `;

    db.query(sql, (err, result) => {
        if (err) {
            res.send(err);
        } else {
            res.json(result);
        }
    });
});

// ---------------- SERVER ----------------
app.listen(3000, () => {
    console.log("🚀 Server running on http://localhost:3000");
});