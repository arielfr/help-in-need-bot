const logger = require('winston-this')('webhook');
const config = require('config');
const express = require('express');
const router = express.Router();
const facebook = require('../services/facebook');
const path = require('path');
const LocationUtil = require('../utils/Location');
const FileUtil = require('../utils/File');

const tempDirectory = path.join(__dirname, '../', 'temp');

/**
 * {
 *  lat: 34.1232
 *  long: -34.1232
 *  votes: 0,
 * }
 */
const reportedLocations = [];

const addLocation = function ({ lat, long }) {
  reportedLocations.push({
    lat,
    long,
    votes: 0,
  });

  console.log(reportedLocations);
};

/**
 * Verification Token Endpoint
 * (This is only for Facebook)
 */
router.get('/webhook', (req, res) => {
  // Your verify token. Should be a random string.
  const VERIFY_TOKEN = config.get('verification_token');

  // Parse the query params
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  // Checks if a token and mode is in the query string of the request
  if (mode && token) {
    // Checks the mode and token sent is correct
    if (mode === 'subscribe' && token === VERIFY_TOKEN) {
      // Responds with the challenge token from the request
      res.status(200).send(challenge);
    } else {
      // Responds with '403 Forbidden' if verify tokens do not match
      res.sendStatus(403);
    }
  }
});

/**
 * Receive message from Facebook
 */
router.post('/webhook', (req, res) => {
  const body = req.body;

  // Checks this is an event from a page subscription
  if (body.object === 'page') {
    logger.debug(`Message receive from page`);

    // Iterates over each entry - there may be multiple if batched
    body.entry.forEach(function(entry) {
      // Gets the message. entry.messaging is an array, but
      // will only ever contain one message, so we get index 0
      const webhook_event = entry.messaging[0];
      const senderId = webhook_event.sender.id;

      // Check if it is a message
      if (webhook_event.message) {
        // Mark message as seen
        facebook.sendAction(senderId, facebook.available_actions.MARK_AS_READ);

        logger.info(JSON.stringify(webhook_event.message));


        if (webhook_event.message.text) {
          const text = webhook_event.message.text;
          const splitText = text.split(' ');
          const command = splitText[0].toLowerCase();

          facebook.sendMessage(senderId, `Hi, we are Help In Need.\n\nThis bot will allow you to empower your community by helping them. If you see a person in street situation you can report it. Then, someone can go and help them.`);

          facebook.sendGeneric(senderId, [
            {
              title: 'Report a person with location',
              subtitle: 'Send us the location where the person is',
            },
            {
              title: 'Report a person with an Image',
              subtitle: 'Send us an image taken on the spot',
            },
            {
              title: 'Type Help',
              subtitle: 'We will send you the locations of the persons near you (1km radius)',
            },
          ]);
        } else if (webhook_event.message.attachments) {
          const attachment = webhook_event.message.attachments[0];

          if (attachment.type === 'location') {
            const location = attachment.payload.location;

            // Add location sent
            addLocation({
              lat: location.coordinates.lat,
              long: location.coordinates.long,
            });
          }

          if (attachment.type === 'image') {
            const payloadUrl = attachment.payload.url;
            const savedFile = path.join(tempDirectory, `${senderId}.report.jpg`);

            // Create Pem Directory if it doesnt exists
            files.createDir(tempDirectory).then(() => {
              facebook.sendAction(senderId, facebook.available_actions.TYPING);

              return files.downloadFile(payloadUrl, savedFile)
            }).then(() => {
              FileUtil.readExif(savedFile).then(exif => {
                const dec = LocationUtil.fromExif(exif);

                // Add location sent
                addLocation({
                  lat: dec.lant,
                  long: dec.long,
                });

                facebook.sendMessage(senderId, `https://www.google.com.ar/maps/search/${dec.lat},${dec.long}`);
              });
            }).catch(err => {
              logger.error(err);
            });
          }
        }
      } else if (webhook_event.postback) {
        logger.info(`postback received`);
      }
    });

    // Returns a '200 OK' response to all requests
    res.status(200).send('EVENT_RECEIVED');
  } else {
    // Returns a '404 Not Found' if event is not from a page subscription
    res.sendStatus(404);
  }
});

module.exports = router;
