const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // This line reaches out to either your .env file (locally) 
    // or your Render Environment Variables (live) to get the correct URI
    const conn = await mongoose.connect(process.env.MONGO_URI);
    
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ Database connection error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;