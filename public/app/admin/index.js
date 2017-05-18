var angular = require('angular');

module.exports = 'mage.admin';

// module.exports = function(moduleName) {
  angular.module('mage.admin', [require('../factories'), require('../filters')])
    .controller('AdminController', require('./admin.controller'));
  require('./users');
  require('./devices')('mage.admin');
  require('./events')('mage.admin');
  require('./layers')('mage.admin');
  require('./settings')('mage.admin');
  require('./teams')('mage.admin');
  // require('./users')(moduleName);
// }
