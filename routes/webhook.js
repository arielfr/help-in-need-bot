const logger = require('winston-this')('webhook');
const config = require('config');
const express = require('express');
const router = express.Router();
const facebook = require('../services/facebook');
const Locations = require('../services/Locations');
const Actions = require('../services/Actions');
const Users = require('../services/Users');

const WELCOME_MESSAGE_NEW = `Welcome to "Help In Need".\n\nThis bot will allow you to empower your community by helping each other. You may wondering, how? Pretty simple!`;
const WELCOME_MESSAGE_OLD = `We really appreciate your help. Would you like to help people in need around you?`;
const BUTTON_REPORT = `By sharing your location, you will be reporting a person in need close to you.`;
const BUTTON_HELP = 'Please share your location in order to see people in need near by.';
const CHOOSE_TEXT = 'You can choose if you want to report the location of someone in need or just know where are the people in need around you.';
const CONGRATS_REPORT = `Thank you for taking the time to help someone in need. If you wan't to report again or help someone in need, talk to me again`;
const CONGRATS_HELP_NO_LOCATIONS = `There are no people in need around you`;
const CONGRATS_HELP = `Your community reported this locations near your location:`;
const CONGRATS_RE_TARGETING = `Would you love to continue helping? Talk to me again!`;

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

        // Check if message comes from a quick reply
        if (webhook_event.message.quick_reply) {
          const quickReply = webhook_event.message.quick_reply;
          let message = '';

          // Set the message depending on the quick reply
          if (quickReply.payload === 'REPORT') {
            message = BUTTON_REPORT;
          } else if (quickReply.payload === 'HELP') {
            message = BUTTON_HELP;
          }

          // Save user last action
          Actions.save(senderId, quickReply.payload);

          // Send the Quick Reply for location
          setTimeout(() => {
            facebook.quickReplyLocation(senderId, message);
          }, 200);
        } else if (webhook_event.message.text) {
          logger.info(`Message receive from user [${senderId}]: ${webhook_event.message.text}`);

          // Welcome message
          if (Users.alreadyInteracted(senderId)) {
            facebook.sendMessage(senderId, WELCOME_MESSAGE_OLD);
          } else {
            // facebook.sendMessage(senderId, WELCOME_MESSAGE_NEW);
          }

          // Wait for previous message comes first
          setTimeout(() => {
            facebook.quickReplyTextButton(senderId, CHOOSE_TEXT, [
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

          // Save the user interacted
          Users.save(senderId);
        } else if (webhook_event.message.attachments) {
          const attachment = webhook_event.message.attachments[0];

          // Check if the attachment is a locatiom
          if (attachment.type === 'location') {
            const location = attachment.payload;

            // If it is a report we save the location reported
            if (Actions.get(senderId) === 'REPORT') {
              Locations.addLocation({
                lat: location.coordinates.lat,
                long: location.coordinates.long,
              });

              facebook.sendMessage(senderId, CONGRATS_REPORT);
              // If it is a help we retrieve the locations
            } else if (Actions.get(senderId) === 'HELP') {
              const locations = Locations.getNearLocations({
                lat: location.coordinates.lat,
                long: location.coordinates.long,
                priority: location.priority,
              });

              if (locations.length > 0) {
                let locationsMessage = CONGRATS_HELP;

                locations.forEach(l => {
                  locationsMessage = locationsMessage.concat(`\n\nhttps://maps.google.com/maps?daddr=${l.lat},${l.long}`);
                });

                facebook.sendMessage(senderId, `${locationsMessage}\n\n${CONGRATS_RE_TARGETING}`);
              } else {
                facebook.sendMessage(senderId, CONGRATS_HELP_NO_LOCATIONS);
              }
            }

            Actions.remove(senderId);
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
