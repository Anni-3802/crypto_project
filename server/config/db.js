 
const mongoose = require('mongoose');

function connectDB() {
    mongoose.connect(process.env.MONGO_URI).then(() => {
        console.log('Connected to DB');
    }).catch((error) => {
        console.error('Error connecting to DB:', error);
    });
}

module.exports = connectDB;
