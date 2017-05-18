var angular = require('angular');

module.exports = 'mage.filters';

angular.module('mage.filters', [])
  .filter('offset', require('./paging-offset.filter'))
  .filter('user', require('./user.filter'));
