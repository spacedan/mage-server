var angular = require('angular');

module.exports = function(moduleName) {
  angular.module(moduleName)
    .directive('banner', require('./banner.directive'))
    .directive('colorPicker', require('./color.picker.directive'))
    .directive('equals', require('./equals.directive'))
    .directive('newsFeed', require('./feed.directive'));
}
