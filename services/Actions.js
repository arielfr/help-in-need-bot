const logger = require('winston-this')('actions-service');

/**
 * This is the class that is going to be used to save the last actions taken from users
 */
class Actions {
  constructor() {
    this.actions = {};
  }

  /**
   * Save user action
   * @param userId
   * @param action
   */
  save(userId, action) {
    logger.debug(`Saving action [user-id=${userId}][action=${action}]`);

    this.actions[userId] = action;
  }

  /**
   * Get last user action
   * @param userId
   * @returns {*}
   */
  get(userId) {
    logger.debug(`Getting action [user-id=${userId}]`);

    if (this.hasAny(userId)) {
      return this.actions[userId];
    } else {
      return false;
    }
  }

  /**
   * Has any user action
   * @param userId
   * @returns {boolean}
   */
  hasAny(userId) {
    return !!this.actions[userId];
  }

  /**
   * Remove user action
   * @param userId
   */
  remove(userId) {
    logger.debug(`Removing action [user-id=${userId}]`);

    delete this.actions[userId];
  }
}

module.exports = new Actions();
