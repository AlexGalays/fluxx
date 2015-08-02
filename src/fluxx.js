var dispatcher = require('./dispatcher');

module.exports = {
  Action:     require('./Action'),
  Store:      require('./Store'),
  ActorStore: require('./ActorStore'),
  onChange:   require('./onChange'),

  NO_CHANGE:  require('./noChange'),

  enableLogs: function() {
  	dispatcher.log = true;
  }
};