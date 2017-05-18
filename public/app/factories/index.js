var angular = require('angular');

module.exports = 'mage.factories';

angular.module('mage.factories', [require('./observation.resource').moduleName, require('../file-upload/file-upload.directive')])
  .factory(require('./api.resource').name, require('./api.resource').factory)
  .factory('Device', require('./device.service').factory)
  .factory('LocalStorageService', require('./local-storage.service').factory)
  .factory('UserService', require('./user.service').factory)
  .factory('LoginService', require('./login.service').factory)
  .factory('Team', require('./team.resource').factory)
  .factory('Event', require('./event.resource').factory)
  .factory('EventService', require('./event.service').factory)
  .factory('ObservationService', require('./observation.service').factory)
  .factory('LocationService', require('./location.service').factory)
  .factory('Location', require('./location.resource').factory)
  .factory('Layer', require('./layer.resource').factory)
  .factory('LayerService', require('./layer.service').factory)
  .factory('FilterService', require('./filter.service').factory)
  .factory('PollingService', require('./polling.service').factory)
  .factory('Settings', require('./settings.resource').factory);
