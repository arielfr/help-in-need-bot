const logger = require('winston-this')('webhook');
const config = require('config');
const express = require('express');
const router = express.Router();
const facebook = require('../services/facebook');
const Locations = require('../services/Locations');
const Actions = require('../services/Actions');
const Users = require('../services/Users');
const MapQuest = require('../services/MapQuest');

const BUTTON_REPORT = `By sharing your location, you will be reporting a person in need close to you.`;
const BUTTON_HELP = 'Please share your location in order to see people in need near by.';
const CHOOSE_TEXT = 'Hi there! Using my help, you can report the location of someone in need or find and help someone close to you';
const CONGRATS_REPORT = `Thank you for taking the time to help someone in need. Would you love to continue helping? Talk to me again!`;
const CONGRATS_HELP_NO_LOCATIONS = `There are no people in need around you. Would you love to continue helping? Talk to me again!`;
//const CONGRATS_HELP = `People in your community reported the following locations:`;
const CONGRATS_RE_TARGETING = `Would you love to continue helping? Talk to me again!`;
const CONGRATS_LOCATIONS = `We have found people in need around this location. Check out the map below: `;
const CUSTOMER_CHAT_CONGRATS_REPORT = `To report someone in need please talk to me from Facebook Messenger. You can use the following link http://m.me/helpinneedbot`;
const CUSTOMER_CHAT_CONGRATS_HELP = `Great! Just look on the map the locations of people in need near you`;
const REPORT_MESSAGE = (location, name) => (`New location reported ${name ? `by ${name}` : ''}. https://help-in-need.now.sh/?lat=${location.coordinates.lat}&long=${location.coordinates.long}`);

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
    body.entry.forEach(function (entry) {
      // Gets the message. entry.messaging is an array, but
      // will only ever contain one message, so we get index 0
      const webhook_event = entry.messaging[0];
      const senderId = webhook_event.sender.id;
      const fbMessage = webhook_event.message;
      const tags = fbMessage.tags;
      const fromCustomerChat = tags ? (tags.source === 'customer_chat_plugin') : false;

      // Check if it is a message
      if (fbMessage) {
        // Mark message as seen
        facebook.sendAction(senderId, facebook.available_actions.MARK_AS_READ);

        // Check if message comes from a quick reply
        if (fbMessage.quick_reply) {
          let message = '';
          const quickReply = fbMessage.quick_reply;

          if (fromCustomerChat) {
            // Set the message depending on the quick reply
            if (quickReply.payload === 'REPORT') {
              message = CUSTOMER_CHAT_CONGRATS_REPORT;
            } else if (quickReply.payload === 'HELP') {
              message = CUSTOMER_CHAT_CONGRATS_HELP;
            }

            facebook.sendMessage(senderId, message);
          } else {
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
          }
        } else if (fbMessage.text) {
          logger.info(`Message receive from user [${senderId}]: ${fbMessage.text}`);

          if (fbMessage.text.indexOf("report") !== -1) {
            // User message contains the text "report"

            // Save user last action
            Actions.save(senderId, "REPORT");

            // Send the Quick Reply for location
            setTimeout(() => {
              facebook.quickReplyLocation(senderId, BUTTON_REPORT);
            }, 200);
          } else {
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
          }
        } else if (fbMessage.attachments) {
          const attachment = fbMessage.attachments[0];

          // Check if the attachment is a locatiom
          if (attachment.type === 'location') {
            const location = attachment.payload;

            // If it is a report we save the location reported
            if (Actions.get(senderId) === 'REPORT') {
              // Generate Static Map URL From MapQuest for Page
              const staticMapUrlForPage = MapQuest.getStaticMapUrl({
                locations: [
                  {
                    lat: location.coordinates.lat,
                    long: location.coordinates.long,
                  }
                ],
              });

              facebook.getUserById(senderId).then(data => {
                Locations.addLocation(data, {
                  lat: location.coordinates.lat,
                  long: location.coordinates.long,
                });

                // Post on Facebook Page asynchronous
                facebook.uploadPagePhotoFromUrl(staticMapUrlForPage, REPORT_MESSAGE(location, data.first_name));
              }).catch((error) => {
                // Save the location if facebook can't get the user
                logger.error(`Can't save the location an error happend getting the user: ${error.message}`);

                Locations.addLocation({}, {
                  lat: location.coordinates.lat,
                  long: location.coordinates.long,
                });

                // Post on Facebook Page asynchronous
                facebook.uploadPagePhotoFromUrl(staticMapUrlForPage, REPORT_MESSAGE(location));
              });

              facebook.sendMessage(senderId, CONGRATS_REPORT);
              // If it is a help we retrieve the locations
            } else if (Actions.get(senderId) === 'HELP') {
              Locations.getNearLocations({
                lat: location.coordinates.lat,
                long: location.coordinates.long,
                priority: location.priority,
              }).then(locations => {
                if (locations.length > 0) {
                  facebook.sendAction(senderId, facebook.available_actions.TYPING);

                  /*
                  let locationsMessage = CONGRATS_HELP;

                  locations.forEach(l => {
                    locationsMessage = locationsMessage.concat(`\n\nhttps://maps.google.com/maps?daddr=${l.lat},${l.long}`);
                  });

                  locationsMessage = locationsMessage.concat(`\n\n`)
                  locationsMessage = locationsMessage.concat(CONGRATS_LOCATIONS)
                  locationsMessage = locationsMessage.concat(`https://help-in-need.now.sh/?lat=${location.coordinates.lat}&long=${location.coordinates.long}`);

                  facebook.sendMessage(senderId, `${locationsMessage}\n\n${CONGRATS_RE_TARGETING}`);
                  */

                  // Generate Static Map URL From MapQuest for Bot
                  const staticMapUrlForBot = MapQuest.getStaticMapUrl({
                    current: {
                      lat: location.coordinates.lat,
                      long: location.coordinates.long,
                    },
                    locations,
                  });

                  facebook.uploadFileFromUrl(staticMapUrlForBot, facebook.valid_attachment_types.IMAGE_FILE).then((id) => {
                    facebook.sendAction(senderId, facebook.available_actions.END_TYPING);

                    facebook.sendMessage(senderId, `${CONGRATS_LOCATIONS}`).then(() => {
                      facebook.sendAttachment(senderId, id, facebook.valid_attachment_types.IMAGE_FILE).then(() => {
                        facebook.sendMessage(senderId, `To see all the locations click here: https://help-in-need.now.sh/?lat=${location.coordinates.lat}&long=${location.coordinates.long}\n\n${CONGRATS_RE_TARGETING}`);
                      });
                    });
                  }).catch((err) => {
                    facebook.sendAction(senderId, facebook.available_actions.END_TYPING);
                  });
                } else {
                  facebook.sendMessage(senderId, CONGRATS_HELP_NO_LOCATIONS);
                }
              });
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
