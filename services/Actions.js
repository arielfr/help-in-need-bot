const logger = require('winston-this')('actions-service');

class Actions {
  constructor() {
    this.lastAction = {};
  }

  saveAction(userId, action) {
    this.lastAction[userId] = action;
  }

  getUserAction(userId) {
    if (this.hasUserLocation(userId)) {
      return this.lastAction[userId];
    } else {
      return false;
    }
  }

  hasUserLocation(userId) {
    return !!this.lastAction[userId];
  }

  removeUserAction(userId) {
    delete this.lastAction[userId];
  }
}

module.exports = new Actions();
