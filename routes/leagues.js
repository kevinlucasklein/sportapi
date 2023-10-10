const express = require('express');
const router = express.Router();
const pool = require('../models/db');

// Create a new league
router.post('/', async (req, res) => {
    try {
        const { name, logo } = req.body;
        const newLeague = await pool.query('INSERT INTO sports_leagues (name, logo) VALUES ($1, $2) RETURNING *', [name, logo]);
        res.json(newLeague.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// List all leagues
router.get('/', async (req, res) => {
    try {
        const allLeagues = await pool.query('SELECT * FROM sports_leagues');
        res.json(allLeagues.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Update a specific league
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { name, logo } = req.body;
        const updatedLeague = await pool.query('UPDATE sports_leagues SET name = $1, logo = $2 WHERE id = $3 RETURNING *', [name, logo, id]);
        if (updatedLeague.rows.length === 0) {
            return res.status(404).json({ error: 'League not found.' });
        }
        res.json(updatedLeague.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Delete a specific league
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const deletedLeague = await pool.query('DELETE FROM sports_leagues WHERE id = $1 RETURNING *', [id]);
        if (deletedLeague.rows.length === 0) {
            return res.status(404).json({ error: 'League not found.' });
        }
        res.json({ message: 'League deleted successfully.' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
