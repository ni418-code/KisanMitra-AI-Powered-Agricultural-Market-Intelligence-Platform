const mongoose = require('mongoose');

async function connectDB() {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    console.error('MONGODB_URI is missing. Add it to your .env file.');
    process.exit(1);
  }

  try {
    await mongoose.connect(uri);
    console.log('MongoDB connected:', mongoose.connection.host);
  } catch (err) {
    console.error('MongoDB connection failed:', err.message);
    console.error(
      'Common causes: wrong username/password in MONGODB_URI, your IP is not whitelisted in Atlas Network Access, or the cluster name is misspelled.'
    );
    process.exit(1);
  }
}

module.exports = connectDB;
