const express = require('express');
const router = express.Router();
const pool = require('../models/db');

// Create a new channel
router.post('/', async (req, res) => {
    try {
        const { name, logo, general_region } = req.body;
        const newChannel = await pool.query('INSERT INTO channels (name, logo, general_region) VALUES ($1, $2, $3) RETURNING *', [name, logo, general_region]);
        res.json(newChannel.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// List all channels
router.get('/', async (req, res) => {
    try {
        const allChannels = await pool.query('SELECT * FROM channels');
        res.json(allChannels.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Update a specific channel
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { name, logo, general_region } = req.body;
        const updatedChannel = await pool.query('UPDATE channels SET name = $1, logo = $2, general_region = $3 WHERE id = $4 RETURNING *', [name, logo, general_region, id]);
        if (updatedChannel.rows.length === 0) {
            return res.status(404).json({ error: 'Channel not found.' });
        }
        res.json(updatedChannel.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Delete a specific channel
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const deletedChannel = await pool.query('DELETE FROM channels WHERE id = $1 RETURNING *', [id]);
        if (deletedChannel.rows.length === 0) {
            return res.status(404).json({ error: 'Channel not found.' });
        }
        res.json({ message: 'Channel deleted successfully.' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
