const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const gamesRoutes = require('./routes/games');
const teamsRoutes = require('./routes/teams');
const leaguesRoutes = require('./routes/leagues');
const broadcastsRoutes = require('./routes/broadcasts');
const channelsRoutes = require('./routes/channels');
// Import other routes as you create them

const app = express();

app.use(cors());
app.use(bodyParser.json());

// Use routes
app.use('/auth', authRoutes);
app.use('/games', gamesRoutes);
app.use('/teams', teamsRoutes);
app.use('/leagues', leaguesRoutes);
app.use('/broadcasts', broadcastsRoutes);
app.use('/channels', channelsRoutes);
// Use other routes as you create them

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
