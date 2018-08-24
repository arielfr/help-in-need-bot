const express = require('express');
const router = express.Router();
const { GOOGLE_MAPS_KEY } = process.env;

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

    res.render('index', {
      gMapsKey,
      current: {
        lat,
        long,
      },
      locations,
      total: totalLocations,
    });
  });
});

router.get('/about', (req, res) => {
  res.send({
    developer_circles: {
      project: 'Messenger Help In Need Chat Bot',
      description: 'Say hello to the first humanitarian bot... This bot will allow to empower, help and bring communities together',
      repository: 'https://github.com/arielfr/help-in-need-bot',
      participants: [
        {
          name: 'Ariel Rey',
          github: 'https://github.com/arielfr',
        },
        {
          name: 'Horacio Lopez',
          github: 'https://github.com/hdlopez',
        },
      ]
    }
  });
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
