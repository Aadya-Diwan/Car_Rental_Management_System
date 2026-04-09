const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// =======================
// DB CONNECTION
// =======================
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root",
    database: "Car_Rental_Management_System"
});

db.connect(err => {
    if (err) {
        console.error("❌ DB Connection Failed:", err);
        return;
    }
    console.log("✅ Connected to MySQL");
});


// =======================
// CREATE CUSTOMER
// =======================
app.post("/customers", (req, res) => {
    const { name, email, phone, license_number } = req.body;

    if (!name || !email || !phone || !license_number) {
        return res.status(400).json({ error: "All fields required ❌" });
    }

    const query = `
        INSERT INTO Customers (name, email, phone, license_number)
        VALUES (?, ?, ?, ?)
    `;

    db.query(query, [name, email, phone, license_number], (err, result) => {
        if (err) return res.status(500).send(err);
        res.json({ customer_id: result.insertId });
    });
});


// =======================
// GET AVAILABLE CARS
// =======================
app.get("/cars", (req, res) => {
    const query = "SELECT * FROM Cars WHERE status='available'";

    db.query(query, (err, result) => {
        if (err) return res.status(500).send(err);
        res.json(result);
    });
});


// =======================
// BOOK CAR (MAIN LOGIC)
// =======================
app.post("/rentals", (req, res) => {
    const { customer_id, car_id, start_date, end_date } = req.body;

    if (!customer_id || !car_id || !start_date || !end_date) {
        return res.status(400).send("Missing fields ❌");
    }

    const start = new Date(start_date);
    const end = new Date(end_date);

    const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24));

    if (days <= 0) {
        return res.status(400).send("Invalid date range ❌");
    }

    // STEP 1: CHECK CAR + GET PRICE
    db.query(
        "SELECT price_per_day FROM Cars WHERE car_id=? AND status='available'",
        [car_id],
        (err, result) => {

            if (err) return res.status(500).send(err);

            if (result.length === 0) {
                return res.status(400).send("Car not available ❌");
            }

            const price = result[0].price_per_day;
            const total = price * days;

            // STEP 2: INSERT RENTAL
            const rentalQuery = `
                INSERT INTO Rentals 
                (customer_id, car_id, start_date, end_date, total_amount, status)
                VALUES (?, ?, ?, ?, ?, 'ongoing')
            `;

            db.query(
                rentalQuery,
                [customer_id, car_id, start_date, end_date, total],
                (err, rentalResult) => {

                    if (err) return res.status(500).send(err);

                    const rentalId = rentalResult.insertId;

                    // STEP 3: UPDATE CAR STATUS
                    db.query(
                        "UPDATE Cars SET status='rented' WHERE car_id=?",
                        [car_id]
                    );

                    // STEP 4: INSERT PAYMENT
                    db.query(
                        "INSERT INTO Payments (rental_id, amount, status) VALUES (?, ?, 'paid')",
                        [rentalId, total]
                    );

                    res.send(`✅ Booking Successful! Total: ₹${total}`);
                }
            );
        }
    );
});


// =======================
// RETURN CAR (OPTIONAL)
// =======================
app.put("/return/:id", (req, res) => {
    const rentalId = req.params.id;

    db.query(
        "SELECT car_id FROM Rentals WHERE rental_id=?",
        [rentalId],
        (err, result) => {

            if (err) return res.status(500).send(err);

            if (result.length === 0) {
                return res.send("Rental not found ❌");
            }

            const carId = result[0].car_id;

            // COMPLETE RENTAL
            db.query(
                "UPDATE Rentals SET status='completed' WHERE rental_id=?",
                [rentalId]
            );

            // MAKE CAR AVAILABLE AGAIN
            db.query(
                "UPDATE Cars SET status='available' WHERE car_id=?",
                [carId]
            );

            res.send("🚗 Car returned successfully");
        }
    );
});


// =======================
// START SERVER
// =======================
app.listen(5000, () => {
    console.log("🚀 Server running on http://localhost:5000");
});