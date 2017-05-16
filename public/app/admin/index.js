var angular = require('angular');

module.exports = function(moduleName) {
  angular.module(moduleName)
    .controller('AdminController', require('./admin.controller'));

  require('./devices')(moduleName);
  require('./events')(moduleName);
  require('./layers')(moduleName);
  require('./settings')(moduleName);
  require('./teams')(moduleName);
  require('./users')(moduleName);
}
