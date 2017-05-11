var angular = require('angular');

module.exports = 'Settings';

angular
	.module('mage')
	.factory(module.exports, Settings);

Settings.$inject = ['$resource'];

function Settings($resource) {
  var Settings = $resource('/api/settings/:type', {
    type: '@type'
  },{
    update: {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      }
    }
  });

  return Settings;
}
