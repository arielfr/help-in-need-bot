const logger = require('winston-this')('actions-service');

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
    this.actions[userId] = action;
  }

  /**
   * Get last user action
   * @param userId
   * @returns {*}
   */
  get(userId) {
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
    delete this.actions[userId];
  }
}

module.exports = new Actions();
