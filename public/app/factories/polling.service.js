var angular = require('angular')
  , _ = require('underscore');

module.exports = 'PollingService';

angular
  .module('mage')
  .service(module.exports, PollingService);

function PollingService() {
  var listeners = [];
  var pollingInterval = 0;

  var service = {
    addListener: addListener,
    removeListener: removeListener,
    setPollingInterval: setPollingInterval
  };

  return service;

  function addListener(listener) {
    listeners.push(listener);

    if (_.isFunction(listener.onPollingIntervalChanged)) {
      listener.onPollingIntervalChanged(pollingInterval);
    }
  }

  function removeListener(listener) {
    listeners = _.reject(listeners, function(l) { return listener === l; });
  }

  function setPollingInterval(interval) {
    pollingInterval = interval;
    _.each(listeners, function(listener) {
      if (_.isFunction(listener.onPollingIntervalChanged)) {
        listener.onPollingIntervalChanged(interval);
      }
    });
  }
}
