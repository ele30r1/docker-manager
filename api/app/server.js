const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });

const reportError = require('./utils/reportError');

process.on('uncaughtException', (err) => {
  reportError(err);
  console.log('UNCAUGHT EXCEPTION! 🔥. Shutting down ...');
  process.exit(1);
});

const app = require('./app');

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});

process.on('unhandledRejection', (err) => {
  reportError(err);
  console.log('UNHANDLED REJETION! 🔥. Shutting down ...');
  server.close(() => {
    process.exit(1);
  });
});
