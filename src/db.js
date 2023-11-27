const mongoose = require("mongoose");
const env = require("dotenv");

env.config();

const url = process.env.MONGO_URI;

const connectDB = async function () {
  return mongoose.connect(url);
};

module.exports = connectDB;
