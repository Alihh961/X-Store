const http = require('http');
const app = require('./app');

const dotenv = require('dotenv').config();


const port = process.env.PORT || 3000;
const server = http.createServer(app);

const connectToDB = require('./config/DBConnection');

// Connection to database
connectToDB();


server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});