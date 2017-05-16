var angular = require('angular');

module.exports = function(moduleName) {
  angular.module(moduleName)
    .controller('AdminEventController', require('./event.controller'))
    .controller('AdminEventEditController', require('./event.edit.controller'))
    .controller('AdminEventEditFormController', require('./event.edit.form.controller'))
    .controller('AdminEventsController', require('./events.controller'))
    .filter('events', require('./events.filter'));
}
