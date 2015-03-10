var dispatcher = require('./dispatcher');

module.exports = {
  Action: require('./Action'),
  Store: require('./Store'),

  enableLogs: function() {
  	dispatcher.log = true;
  }
};