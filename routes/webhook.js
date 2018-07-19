const logger = require('winston-this')('webhook');
const config = require('config');
const express = require('express');
const router = express.Router();
const facebook = require('../services/facebook');
const Locations = require('../services/Locations');
const Actions = require('../services/Actions');

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

        if (webhook_event.message.quick_reply) {
          const quickReply = webhook_event.message.quick_reply;
          let message = '';

          if (quickReply.payload === 'REPORT') {
            message = 'By sharing your location, you will reporting a person in need near you or exactly where you are.';
          } else if (quickReply.payload === 'HELP') {
            message = 'By sharing your location, you will receive a list of locations near your.';
          }

          facebook.sendMessage(senderId, message);

          // Save user last action
          Actions.saveAction(senderId, quickReply.payload);

          setTimeout(() => {
            facebook.quickReplyLocation(senderId, 'Send location');
          }, 200);
        } else if (webhook_event.message.text) {
          // Welcome message
          facebook.sendMessage(senderId, `Welcome to "Help In Need".\n\nThis bot will allow you to empower your community by helping each other. You may wondering, how? Pretty simple!`);

          // Wait for previous message comes first
          setTimeout(() => {
            facebook.quickReplyTextButton(senderId, 'You can choose if you want to report the location of someone in need or just know where are the people in need around you.', [
              {
                title: 'Report',
                payload: 'REPORT',
              },
              {
                title: 'Help',
                payload: 'HELP',
              },
            ]);
          }, 200);
        } else if (webhook_event.message.attachments) {
          const attachment = webhook_event.message.attachments[0];

          if (attachment.type === 'location') {
            const location = attachment.payload;

            if (Actions.getUserAction(senderId) === 'REPORT') {
              Locations.addLocation({
                lat: location.coordinates.lat,
                long: location.coordinates.long,
              });

              facebook.sendMessage(senderId, `Thank you for taking the time to help persons in need. Your location has been reported.`);
            } else if (Actions.getUserAction(senderId) === 'HELP') {
              const locations = Locations.getNearLocations({
                lat: location.coordinates.lat,
                long: location.coordinates.long,
                priority: location.priority,
              });

              if (locations.length > 0) {
                let locationsMessage = 'Your community reported this locations near your location:';

                locations.forEach(l => {
                  locationsMessage = locationsMessage.concat(`\n\nhttps://maps.google.com/maps?daddr=${l.lat},${l.long}`);
                });

                facebook.sendMessage(senderId, locationsMessage);
              } else {
                facebook.sendMessage(senderId, `There are no persons in need around you. If you see someone report it`);
              }
            }

            Actions.removeUserAction(senderId);
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
