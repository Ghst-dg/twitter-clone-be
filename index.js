const express = require('express')
const app = express()
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const authController = require('./controllers/authController');
const authenticateToken = require('./middleware/authMiddleware');
const activityController = require('./controllers/activityController');
const tweetController = require('./controllers/tweetController');
const cors = require('cors');
require('dotenv').config();
app.use(cors());

const connectionString = process.env.DATABASE_URL;
mongoose.connect(connectionString, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});
const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
    console.log('Connected to the database');
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.post('/register', authController.registerUser);
app.post('/login', authController.loginUser);

app.post('/follow/:userId', authenticateToken, activityController.followUser);
app.post('/unfollow/:userId', authenticateToken, activityController.unfollowUser);

app.post('/tweets', authenticateToken, tweetController.createTweet);
app.put('/tweets/:tweetId', authenticateToken, tweetController.editTweet); 
app.delete('/tweets/:tweetId', authenticateToken, tweetController.deleteTweet);
app.get('/timeline', authenticateToken, tweetController.getTimeline);

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
