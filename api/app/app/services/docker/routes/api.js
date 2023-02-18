const express = require('express');

const router = express.Router();

const containerController = require('../controllers/containerController');
const imageController = require('../controllers/imageController');

router.get('/container', containerController.index);
router.get('/container/:containerId', containerController.get);
router.get('/container/:containerId/stats', containerController.getStats);
router.get(
  '/container/:containerId/action/:action',
  containerController.action
);
router.post(
  '/container-commit/:container/:repo/:tag',
  containerController.commit
);

router.get('/image', imageController.index);
router.get('/image/search', imageController.search);
router.post('/image/create/:image', imageController.create);
// router.get('/about-us', statickPagesController.aboutUs);
// router.get('/privacy', statickPagesController.privacy);

module.exports = (app) => {
  app.use(`/docker-api`, router);
};
