const express = require('express');
const router = express.Router();
const pool = require('../models/db');

// Create a new sporting event
router.post('/', async (req, res) => {
    try {
        const { team1_id, team2_id, event_date, time, location } = req.body;
        const newGame = await pool.query('INSERT INTO games (team1_id, team2_id, event_date, time, location) VALUES ($1, $2, $3, $4, $5) RETURNING *', [team1_id, team2_id, event_date, time, location]);
        res.json(newGame.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// List all sporting events
router.get('/', async (req, res) => {
    try {
        const allGames = await pool.query('SELECT * FROM games');
        res.json(allGames.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Update a specific sporting event
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { team1_id, team2_id, event_date, time, location } = req.body;
        const updatedGame = await pool.query('UPDATE games SET team1_id = $1, team2_id = $2, event_date = $3, time = $4, location = $5 WHERE id = $6 RETURNING *', [team1_id, team2_id, event_date, time, location, id]);
        if (updatedGame.rows.length === 0) {
            return res.status(404).json({ error: 'Game not found.' });
        }
        res.json(updatedGame.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Delete a specific sporting event
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const deletedGame = await pool.query('DELETE FROM games WHERE id = $1 RETURNING *', [id]);
        if (deletedGame.rows.length === 0) {
            return res.status(404).json({ error: 'Game not found.' });
        }
        res.json({ message: 'Game deleted successfully.' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
