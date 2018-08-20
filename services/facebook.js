const config = require('config');
const logger = require('winston-this')('facebook');
const fb = require('fb');
const request = require('request');
const FileUtil = require('../utils/File');
const isProduction = (process.env.NODE_ENV === 'production');

fb.setAccessToken(config.get('token'));
fb.options({version: 'v2.6'});

module.exports = {
  /**
   * Available actions from FB Documentation
   */
  available_actions: {
    MARK_AS_READ: 'mark_seen',
    TYPING: 'typing_on',
    END_TYPING: 'typing_off',
  },
  /**
   * Valid attachment types from FB Documentation
   */
  valid_attachment_types: {
    AUDIO_FILE: 'audio',
    VIDEO_FILE: 'video',
    IMAGE_FILE: 'image',
    GENERIC_FILE: 'file',
  },
  getUserById(userId) {
    return new Promise((resolve, reject) => {
      fb.api(userId, (res) => {
        if (!res || res.error) {
          logger.error(`An error ocurr on sendMessage: ${res.error.message}`);
          reject(res.error);
          return;
        }

        logger.info(`Get user information with id = ${userId}`);
        resolve(res);
      });
    });
  },
  /**
   * Send message to Facebook User
   * @param senderId
   * @param message
   */
  sendMessage: (senderId, message) => {
    return new Promise((resolve, reject) => {
      if (isProduction) {
        fb.api('/me/messages', 'POST', {
          recipient: {
            id: senderId
          },
          message: {
            text: message
          },
        }, (res) => {
          if (!res || res.error) {
            logger.error(`An error ocurr on sendMessage: ${res.error.message}`);
            reject(res.error);
            return;
          }

          logger.info(`Message sent to user: ${senderId}: ${message}`);
          resolve(true);
        });
      } else {
        logger.info(message);
        resolve(true);
      }
    });
  },
  /**
   * Send action to Facebook
   * @param sendId
   * @param action
   */
  sendAction: (senderId, action) => {
    if (isProduction) {
      fb.api('/me/messages', 'POST', {
        recipient: {
          id: senderId
        },
        sender_action: action,
      }, (res) => {
        if (!res || res.error) {
          logger.error(`An error ocurr on sendAction: ${res.error.message}`);
          return;
        }

        logger.info(`Reaction sent to user: ${senderId}`);
      });
    } else {
      logger.info(action);
    }
  },
  /**
   * Send a list template message
   * @param senderId
   * @param elements
   * @param isCompact
   */
  sendList: (senderId, elements, isCompact = true) => {
    if (isProduction) {
      fb.api('/me/messages', 'POST', {
        recipient: {
          id: senderId
        },
        message: {
          attachment: {
            type: 'template',
            payload: {
              template_type: 'list',
              top_element_style: isCompact ? 'compact' : 'large',
              elements: elements,
            }
          }
        },
      }, (res) => {
        if (!res || res.error) {
          logger.error(`An error ocurr on sendAction: ${res.error.message}`);
          return;
        }

        logger.info(`Reaction sent to user: ${senderId}`);
      });
    } else {
      logger.info(items);
    }
  },
  /**
   * Send Buttons Template
   * @param senderId
   * @param text
   * @param buttons
   */
  sendButtonTemplate: (senderId, text, buttons) => {
    if (isProduction) {
      fb.api('/me/messages', 'POST', {
        recipient: {
          id: senderId
        },
        message: {
          attachment: {
            type: 'template',
            payload: {
              template_type: 'button',
              text: text,
              buttons: buttons,
            }
          }
        },
      }, (res) => {
        if (!res || res.error) {
          logger.error(`An error ocurr on sendAction: ${res.error.message}`);
          return;
        }

        logger.info(`Reaction sent to user: ${senderId}`);
      });
    } else {
      logger.info(items);
    }
  },
  /**
   * Send generic template
   * @param senderId
   * @param elements
   */
  sendGeneric: (senderId, elements) => {
    if (isProduction) {
      fb.api('/me/messages', 'POST', {
        recipient: {
          id: senderId
        },
        message: {
          attachment: {
            type: 'template',
            payload: {
              template_type: 'generic',
              elements: elements,
            }
          }
        },
      }, (res) => {
        if (!res || res.error) {
          logger.error(`An error ocurr on sendAction: ${res.error.message}`);
          return;
        }

        logger.info(`Reaction sent to user: ${senderId}`);
      });
    } else {
      logger.info(JSON.stringify(elements));
    }
  },
  /**
   * Send attachment
   * @param senderId
   * @param attachmentId
   * @param type
   */
  sendAttachment: (senderId, attachmentId, type = this.valid_attachment_types.GENERIC_FILE) => {
    if (isProduction) {
      fb.api('/me/messages', 'POST', {
        recipient: {
          id: senderId
        },
        message: {
          attachment: {
            type: type,
            payload: {
              attachment_id: attachmentId,
            }
          }
        },
      }, (res) => {
        if (!res || res.error) {
          logger.error(`An error ocurr sending the attachment: ${res.error.message}`);
          return;
        }

        logger.info(`Attachment sent to user: ${senderId}`);
      });
    } else {
      logger.info(attachmentId);
    }
  },
  /**
   * Upload file to Facebook and get the id to attach the message
   * @param attachmentPath
   * @param type
   * @returns {Promise}
   */
  uploadFile: (attachmentPath, type = this.valid_attachment_types.GENERIC_FILE) => {
    return new Promise((resolve, reject) => {
      const formData = {
        message: JSON.stringify({
          attachment: {
            type: type,
            payload: {
              is_reusable: true,
            }
          }
        }),
        filedata: FileUtil.createReadStream(attachmentPath)
      };

      request.post({
        url: `https://graph.facebook.com/v2.6/me/message_attachments?access_token=${config.get('token')}`,
        formData,
      }, (err, response, body) => {
        if (err) {
          logger.error(JSON.parse(err).message);
          return reject(`An error ocurr generating the response`);
        }

        resolve(JSON.parse(body).attachment_id);
      });
    })
  },
  /**
   * Quick reply asking for location
   * @param senderId
   * @param message
   * @returns {Promise<any>}
   */
  quickReplyLocation: (senderId, message) => {
    return new Promise((resolve, reject) => {
      if (isProduction) {
        fb.api('/me/messages', 'POST', {
          recipient: {
            id: senderId
          },
          message: {
            text: message,
            quick_replies: [
              {
                content_type: 'location',
              }
            ]
          },
        }, (res) => {
          if (!res || res.error) {
            logger.error(`An error ocurr on sendMessage: ${res.error.message}`);
            reject(res.error);
            return;
          }

          logger.info(`Message sent to user: ${senderId}`);
          resolve(true);
        });
      } else {
        logger.info(message);
        resolve(true);
      }
    });
  },
  /**
   * Quick reply button with text
   * @param senderId
   * @param message
   * @param elements
   * @returns {Promise<any>}
   */
  quickReplyTextButton: (senderId, message, elements = []) => {
    return new Promise((resolve, reject) => {
      if (isProduction) {
        fb.api('/me/messages', 'POST', {
          recipient: {
            id: senderId
          },
          message: {
            text: message,
            quick_replies: elements.map(el => ({
              content_type: 'text',
              title: el.title,
              payload: el.payload,
            })),
          },
        }, (res) => {
          if (!res || res.error) {
            logger.error(`An error ocurr on sendMessage: ${res.error.message}`);
            reject(res.error);
            return;
          }

          logger.info(`Message sent to user: ${senderId}`);
          resolve(true);
        });
      } else {
        logger.info(message);
        resolve(true);
      }
    });
  },
};
