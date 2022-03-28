const mongoose = require('mongoose');

module.exports = async () => {
  await mongoose.connect(process.env.MONGO_URI || '', {
    keepAlive: true
  });
  return mongoose;
}