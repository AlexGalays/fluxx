var dispatcher = require('./dispatcher');

module.exports = {
  Action:    require('./Action'),
  Store:     require('./Store'),

  NO_CHANGE: require('./noChange'),

  enableLogs: function() {
  	dispatcher.log = true;
  }
};