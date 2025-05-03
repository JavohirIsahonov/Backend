const mongoose = require('mongoose');
const colors = require('colors');


const connectDB = async () => {
    try{
        mongoose.set('strictQuery', true);
        const connecting = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB connected: ${connecting.connection.host}`.cyan.underline.bold);
    }catch (error) {
        console.error(`Error: ${error.message}`.red.bold);
        process.exit(1);
    }
};

module.exports = connectDB;