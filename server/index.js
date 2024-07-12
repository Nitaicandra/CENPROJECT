const http = require('http');
const app = require('./app');
const server = http.createServer(app);
require("dotenv").config();
const PORT = 3001

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});