const express = require('express');
const router = express.Router();
const pool = require('../models/db');

// Create a new team
router.post('/', async (req, res) => {
    try {
        const { league_id, name, logo } = req.body;
        const newTeam = await pool.query('INSERT INTO teams (league_id, name, logo) VALUES ($1, $2, $3) RETURNING *', [league_id, name, logo]);
        res.json(newTeam.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// List all teams
router.get('/', async (req, res) => {
    try {
        const allTeams = await pool.query('SELECT * FROM teams');
        res.json(allTeams.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Update a specific team
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { league_id, name, logo } = req.body;
        const updatedTeam = await pool.query('UPDATE teams SET league_id = $1, name = $2, logo = $3 WHERE id = $4 RETURNING *', [league_id, name, logo, id]);
        if (updatedTeam.rows.length === 0) {
            return res.status(404).json({ error: 'Team not found.' });
        }
        res.json(updatedTeam.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Delete a specific team
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const deletedTeam = await pool.query('DELETE FROM teams WHERE id = $1 RETURNING *', [id]);
        if (deletedTeam.rows.length === 0) {
            return res.status(404).json({ error: 'Team not found.' });
        }
        res.json({ message: 'Team deleted successfully.' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
