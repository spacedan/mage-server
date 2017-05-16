var angular = require('angular');

module.exports = function(moduleName) {
  angular.module(moduleName)
    .controller('AdminLayerController', require('./layer.controller'))
    .controller('AdminLayerEditController', require('./layer.edit.controller'))
    .controller('AdminLayersController', require('./layers.controller'));
}
