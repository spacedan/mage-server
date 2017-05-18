window.jQuery = window.$ = require('jquery');

var angular = require('angular');

require('jquery-minicolors');
require('angular-minicolors');

angular
  .module("mage", [
    require('./app/admin'),
    require('./app/factories'),
    require('angular-ui-bootstrap'),
    require('ui-select'),
    "minicolors",
    require('angular-animate'),
    require('angular-sanitize'),
    require('angular-route'),
    require('angular-resource'),
    require('angular-messages'),
    require('./app/auth/http-auth-interceptor'),
    require('videogular'),
    require('videogular-controls'),
    require('videogular-overlay-play')
  ]);

require('./app');
