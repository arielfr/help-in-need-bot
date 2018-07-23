const logger = require('winston-this')('users-service');

/**
 * This class is going to be saving the users interacting with the Bot
 */
class Users {
  constructor() {
    this.users = [];
  }

  /**
   * Check if the user has already interacted
   * @param userId
   * @returns {boolean}
   */
  alreadyInteracted(userId) {
    return this.users.indexOf(userId) !== -1;
  }

  /**
   * Save user
   * @param userId
   */
  save(userId) {
    if (!this.alreadyInteracted(userId)) {
      logger.info(`Saving user: ${userId}`);

      this.users.push(userId);
    }
  }
}

module.exports = new Users();
