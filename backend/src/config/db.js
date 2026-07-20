const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            dbName: process.env.DB_NAME,
        });
        console.log('DB connected.');
    } catch (error) {
        console.error('Failed to connect DB');
        console.error(error.message);
        process.exit(1);
    }
};

module.exports = connectDB;
