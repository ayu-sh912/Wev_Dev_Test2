const mongoose = require('mongoose');

module.exports = async function connectDB() {
  const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/gun_inventory';

  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  return mongoose.connect(mongoUri);
};
