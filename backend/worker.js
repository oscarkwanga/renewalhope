// worker.js
require('dotenv').config();
const mongoose = require('mongoose');

const { scheduleMonthlyStatements } = require('./jobs/monthlyStatements');

const mongoUri = process.env.ATLAS || process.env.MONGO_URI;
if (!mongoUri) {
  console.error('No Mongo connection string in ATLAS/MONGO_URI');
  process.exit(1);
}

mongoose.connect(mongoUri)
  .then(() => {
    console.log('Worker: DB connected');
    scheduleMonthlyStatements();
  })
  .catch(err => {
    console.error('Worker: DB connection error', err);
    process.exit(1);
  });
