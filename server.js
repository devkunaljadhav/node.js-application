require('dotenv').config();
const app = require('./src/app');

const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || 'development';

const server = app.listen(PORT, () => {
  console.log(`=========================================`);
  console.log(` App Name:    nodejs-cicd-app`);
  console.log(` Environment: ${NODE_ENV}`);
  console.log(` Server Port: ${PORT}`);
  console.log(` Health URL:  http://localhost:${PORT}/health`);
  console.log(`=========================================`);
});

module.exports = server;
