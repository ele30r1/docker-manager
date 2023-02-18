const fs = require('fs');
const express = require('express');

const exporessApiRouter = express.Router();
exporessApiRouter.use((req, res, next) => {
  res.append('content-type', 'application/json');
  next();
});

const exporessWebRouter = express.Router();

const apiPrefix = '/api';

const resolveRoutes = (app) => {
  fs.readdirSync('./app/services', { withFileTypes: true })
    .filter((el) => el.isDirectory())
    .map((el) => el.name)
    .forEach((dir) => {
      const apiRoutesFile = `./app/services/${dir}/routes/api.js`;
      if (fs.existsSync(apiRoutesFile)) {
        const apiRouter = require(`../../${apiRoutesFile}`);
        apiRouter(app, exporessApiRouter, apiPrefix);
      }
    });

  // fs.readdirSync('./app/services', { withFileTypes: true })
  //   .filter((el) => el.isDirectory())
  //   .map((el) => el.name)
  //   .forEach((dir) => {
  //     const webRutesFile = `./app/services/${dir}/routes/web.js`;
  //     if (fs.existsSync(webRutesFile)) {
  //       const webRouter = require(`../../${webRutesFile}`);
  //       webRouter(app, exporessWebRouter, '/');
  //     }
  //   });
};

module.exports = { resolveRoutes };
