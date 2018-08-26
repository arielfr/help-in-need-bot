const config = require('config');
const logger = require('winston-this')('facebook');
const fb = require('fb');
const request = require('request');
const FileUtil = require('../utils/File');
const isProduction = (process.env.NODE_ENV === 'production');
const { FB_TOKEN_MESSENGER, FB_TOKEN_PAGE } = process.env;

// Set API Version
fb.options({version: 'v2.6'});

// Create a new Facebook Messenger Instance
const FBMessenger = fb.withAccessToken(FB_TOKEN_MESSENGER);
const FBPage = fb.withAccessToken(FB_TOKEN_PAGE);

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
  /**
   * Get user by id
   * @param userId
   * @returns {Promise<any>}
   */
  getUserById(userId) {
    return new Promise((resolve, reject) => {
      FBMessenger.api(userId, (res) => {
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
        FBMessenger.api('/me/messages', 'POST', {
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
      FBMessenger.api('/me/messages', 'POST', {
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
      FBMessenger.api('/me/messages', 'POST', {
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
      FBMessenger.api('/me/messages', 'POST', {
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
      FBMessenger.api('/me/messages', 'POST', {
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
    return new Promise((resolve, reject) => {
      if (isProduction) {
        FBMessenger.api('/me/messages', 'POST', {
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
            reject(res.error.message);
          }

          logger.info(`Attachment sent to user: ${senderId}`);

          resolve(true);
        });
      } else {
        logger.info(attachmentId);

        return resolve(attachmentId);
      }
    });
  },
  /**
   * Upload file to Facebook and get the id to attach the message
   * @param attachmentPath
   * @param type
   * @returns {Promise}
   */
  uploadFile: (attachmentPath, type = this.valid_attachment_types.GENERIC_FILE) => {
    return new Promise((resolve, reject) => {
      FB.api('me/message_attachments', 'post', {
        message: {
          attachment: {
            type: type,
            payload: {
              is_reusable: true,
            }
          }
        },
        filedata: FileUtil.createReadStream(attachmentPath)
      }, (res) => {
        if (!res || res.error) {
          logger.error(`An error ocurr on uploading file: ${res.error.message}`);
          reject(res.error);
          return;
        }

        logger.info(`File was uploaded successfully: ${res.attachment_id}`);
        resolve(res.attachment_id);
      });
    })
  },
  /**
   * Upload file from URL
   * @param url
   * @param type
   * @returns {Promise<any>}
   */
  uploadFileFromUrl: (url, type = this.valid_attachment_types.IMAGE_FILE) => {
    return new Promise((resolve, reject) => {
      FBMessenger.api('me/message_attachments', 'post', {
        message:{
          attachment:{
            type: type,
            payload:{
              is_reusable: true,
              url: url
            }
          }
        },
      }, (res) => {
        if (!res || res.error) {
          logger.error(`An error ocurr on uploading file: ${res.error.message}`);
          reject(res.error);
          return;
        }

        logger.info(`File was uploaded successfully: ${res.attachment_id}`);
        resolve(res.attachment_id);
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
        FBMessenger.api('/me/messages', 'POST', {
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
        FBMessenger.api('/me/messages', 'POST', {
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
  /**
   * Post photo to page
   * @param url
   * @returns {Promise<any>}
   */
  uploadPagePhotoFromUrl: (url, caption, published = true) => {
    return new Promise((resolve, reject) => {
      FBPage.api('/me/photos', 'POST', {
        url: url,
        caption: caption,
        published: published,
      }, (res) => {
        if (!res || res.error) {
          logger.error(`An error ocurr uploading photo: ${res.error.message}`);
          reject(res.error);
          return;
        }

        logger.info(`Image uploaded: ${res.id}`);
        resolve(res.id);
      });
    });
  },
  /**
   * Post on Page
   * @param message
   * @param objectId
   * @returns {Promise<any>}
   */
  postOnPageWithAttachment: (message, objectId) => {
    return new Promise((resolve, reject) => {
      FBPage.api('/me/feed', 'POST', {
        message: message,
        object_attachment: objectId,
      }, (res) => {
        if (!res || res.error) {
          logger.error(`An error ocurr posting on page: ${res.error.message}`);
          reject(res.error);
          return;
        }

        logger.info(`Post done`);
        resolve(true);
      });
    });
  }
};
