const express = require('express');
const router = express.Router();
const { GOOGLE_MAPS_KEY } = process.env;
const IndexPage = require('../pages/index');
const AboutPage = require('../pages/about');

const Locations = require('../services/Locations');

router.get('/', (req, res) => {
  const { lat, long } = req.query;
  const gMapsKey = GOOGLE_MAPS_KEY;

  Promise.all([
    Locations.getGmapsLocations(),
    Locations.getTotal()
  ]).then(resPromises => {
    const locations = resPromises[0];
    const totalLocations = resPromises[1];

    res.send(
      IndexPage(gMapsKey,
        {
          lat,
          long,
        },
        locations,
        totalLocations)
    );
  });
});

router.get('/about', (req, res) => {
  res.send(AboutPage());
});

router.get('/expire', (req, res) => {
  Locations.expireYesterday().then(() => {
    res.send({
      result: 'OK',
    })
  }).catch((err) => {
    res.send({
      result: err,
    })
  });
});

router.get('/drop', (req, res) => {
  Locations.deleteAll().then(() => {
    res.send({
      result: 'OK',
    })
  }).catch((err) => {
    res.send({
      result: err,
    })
  });
});

module.exports = router;
