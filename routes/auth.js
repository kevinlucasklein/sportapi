const express = require('express');
const router = express.Router();
const pool = require('../models/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const JWT_SECRET = 'your_secret_key'; // Remember to move this to an environment variable or config file later.

// User Registration
router.post('/register', async (req, res) => {
    try {
        const { username, password, email, location } = req.body;

        // Check if user exists
        const user = await pool.query('SELECT * FROM users WHERE username = $1 OR email = $2', [username, email]);
        if (user.rows.length > 0) {
            return res.status(400).json({ error: 'User with that username or email already exists.' });
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Insert the user into the database
        const newUser = await pool.query('INSERT INTO users (username, password, email, location) VALUES ($1, $2, $3, $4) RETURNING *', [username, hashedPassword, email, location]);
        res.json(newUser.rows[0]);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// User Authentication
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        // Check if user exists
        const user = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
        if (user.rows.length === 0) {
            return res.status(400).json({ error: 'Invalid credentials.' });
        }

        // Compare passwords
        const validPassword = await bcrypt.compare(password, user.rows[0].password);
        if (!validPassword) {
            return res.status(400).json({ error: 'Invalid credentials.' });
        }

        // Generate JWT
        const token = jwt.sign({ id: user.rows[0].id }, JWT_SECRET, { expiresIn: '1h' });
        res.json({ token });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
