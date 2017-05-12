var angular = require('angular');

module.exports = 'LayerService';

angular
  .module('mage')
  .factory(module.exports, LayerService);

LayerService.$inject = ['$q', require('./layer.resource')];

function LayerService($q, Layer) {
  var service = {
    getLayersForEvent: getLayersForEvent
  };

  return service;

  function getLayersForEvent(event) {
    var deferred = $q.defer();
    Layer.queryByEvent({eventId: event.id}, function(layers) {
      deferred.resolve(layers);
    });

    return deferred.promise;
  }
}
