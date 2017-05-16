var angular = require('angular');

var settings = require('./settings.resource');

module.exports = function(moduleName) {
  angular.module(moduleName)
    .controller('AdminSettingsController', require('./settings.controller'));
}
