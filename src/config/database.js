const mongoose = require('mongoose');
require('dotenv').config();

function connexion() {
    mongoose.connect(process.env.MONGO_URI_LOCAL);
    const db = mongoose.connection;

    db.on('error', (error) => {
        console.error('MongoDB connection error:', error);
    });

    db.once('open', () => {
        console.log('Connected to MongoDB');
    });
}
module.exports = connexion;