const mongoose = require("mongoose");
const dotenv = require('dotenv').config();


const username = encodeURIComponent(process.env.DB_USERNAME);
const password = encodeURIComponent(process.env.DB_CONX_PASS);
const cluster = process.env.CLUSTER_NAME;
const dataBaseName = process.env.DB_NAME;


const uri = `mongodb+srv://${username}:${password}@${cluster}.vau0p.mongodb.net/${dataBaseName}?retryWrites=true&w=majority&appName=${cluster}`;


async function connectToDB() {
  try {
    await mongoose.connect(uri);
    console.log('Connected to MongoDB Atlas with success');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
  }
}

module.exports = connectToDB