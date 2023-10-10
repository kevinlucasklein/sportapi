const express = require('express');
const router = express.Router();
const pool = require('../models/db');

// Create a new broadcast
router.post('/', async (req, res) => {
    try {
        const { game_id, channel_id, region } = req.body;
        const newBroadcast = await pool.query('INSERT INTO broadcasts (game_id, channel_id, region) VALUES ($1, $2, $3) RETURNING *', [game_id, channel_id, region]);
        res.json(newBroadcast.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// List all broadcasts with channel details
router.get('/', async (req, res) => {
    try {
        const allBroadcasts = await pool.query('SELECT b.id, b.game_id, b.channel_id, c.name as channel_name, c.logo as channel_logo, b.region FROM broadcasts b INNER JOIN channels c ON b.channel_id = c.id');
        res.json(allBroadcasts.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Retrieve broadcasts by game with channel details
router.get('/game/:game_id', async (req, res) => {
    try {
        const { game_id } = req.params;
        const broadcastsForGame = await pool.query('SELECT b.id, b.game_id, b.channel_id, c.name as channel_name, c.logo as channel_logo, b.region FROM broadcasts b INNER JOIN channels c ON b.channel_id = c.id WHERE b.game_id = $1', [game_id]);
        res.json(broadcastsForGame.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Update a specific broadcast
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { game_id, channel_id, region } = req.body;
        const updatedBroadcast = await pool.query('UPDATE broadcasts SET game_id = $1, channel_id = $2, region = $3 WHERE id = $4 RETURNING *', [game_id, channel_id, region, id]);
        if (updatedBroadcast.rows.length === 0) {
            return res.status(404).json({ error: 'Broadcast not found.' });
        }
        res.json(updatedBroadcast.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Delete a specific broadcast
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const deletedBroadcast = await pool.query('DELETE FROM broadcasts WHERE id = $1 RETURNING *', [id]);
        if (deletedBroadcast.rows.length === 0) {
            return res.status(404).json({ error: 'Broadcast not found.' });
        }
        res.json({ message: 'Broadcast deleted successfully.' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
