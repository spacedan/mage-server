var angular = require('angular');

module.exports = function(moduleName) {
  angular.module(moduleName)
    .controller('AdminDeviceController', require('./device.controller'))
    .controller('AdminDeviceEditController', require('./device.edit.controller'))
    .controller('AdminDevicesController', require('./devices.controller'));
}
