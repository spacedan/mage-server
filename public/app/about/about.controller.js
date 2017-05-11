var angular = require('angular');

module.exports = 'AboutController';

angular
  .module('mage')
  .controller(module.exports, AboutController);

AboutController.$inject = ['$scope', require('../factories/api.resource')];

function AboutController ($scope, Api) {

  Api.get(function(api) {
    $scope.name = api.name;
    $scope.serverVersion = api.version;
    $scope.apk = api.apk;
  });
}
