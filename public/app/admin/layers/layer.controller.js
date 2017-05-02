angular
  .module('mage')
  .controller('AdminLayerController', AdminLayerController);

AdminLayerController.$inject = ['$scope', '$uibModal', '$routeParams', '$location', '$filter', 'Layer', 'Event', 'LocalStorageService'];

function AdminLayerController($scope, $uibModal, $routeParams, $location, $filter, Layer, Event, LocalStorageService) {

  $scope.layerEvents = [];
  $scope.nonTeamEvents = [];
  $scope.eventsPage = 0;
  $scope.eventsPerPage = 10;

  $scope.uploads = [{}];
  $scope.uploadConfirmed = false;

  Layer.get({id: $routeParams.layerId}, function(layer) {
    $scope.layer = layer;

    if ($scope.layer.type === 'GeoPackage') {
      $scope.layer.geopackage = $scope.layer.geopackage || {};
      $scope.fileUploadOptions = {
        acceptFileTypes: /(\.|\/)(gpkg)$/i,
        url: '/api/layers/' + $routeParams.layerId + '/gpkg?access_token=' + LocalStorageService.getToken(),
        previewFunction: $scope.geopackagePreview,
        preview: true
      };
    } else {
      $scope.fileUploadOptions = {
        acceptFileTypes: /(\.|\/)(kml)$/i,
        url: '/api/layers/' + $routeParams.layerId + '/kml?access_token=' + LocalStorageService.getToken()
      };
    }

    Event.query(function(events) {
      $scope.event = {};
      $scope.layerEvents = _.filter(events, function(event) {
        return _.some(event.layers, function(layer) {
          return $scope.layer.id === layer.id;
        });
      });

      $scope.nonLayerEvents = _.reject(events, function(event) {
        return _.some(event.layers, function(layer) {
          return $scope.layer.id === layer.id;
        });
      });
    });
  });

  $scope.filterEvents = function(event) {
    var filteredEvents = $filter('filter')([event], $scope.eventSearch);
    return filteredEvents && filteredEvents.length;
  };

  $scope.addEventToLayer = function(event) {
    Event.addLayer({id: event.id}, $scope.layer, function(event) {
      $scope.layerEvents.push(event);
      $scope.nonLayerEvents = _.reject($scope.nonLayerEvents, function(e) { return e.id === event.id; });

      $scope.event = {};
    });
  };

  $scope.removeEventFromLayer = function($event, event) {
    $event.stopPropagation();

    Event.removeLayer({id: event.id, layerId: $scope.layer.id}, function(event) {
      $scope.layerEvents = _.reject($scope.layerEvents, function(e) { return e.id === event.id; });
      $scope.nonLayerEvents.push(event);
    });
  };

  $scope.editLayer = function(layer) {
    $location.path('/admin/layers/' + layer.id + '/edit');
  };

  $scope.gotoEvent = function(event) {
    $location.path('/admin/events/' + event.id);
  };

  $scope.deleteLayer = function() {
    var modalInstance = $uibModal.open({
      templateUrl: '/app/admin/layers/layer-delete.html',
      resolve: {
        layer: function () {
          return $scope.layer;
        }
      },
      controller: ['$scope', '$uibModalInstance', 'layer', function ($scope, $uibModalInstance, layer) {
        $scope.layer = layer;

        $scope.deleteLayer = function(layer) {
          layer.$delete(function() {
            $uibModalInstance.close(layer);
          });
        };

        $scope.cancel = function () {
          $uibModalInstance.dismiss('cancel');
        };
      }]
    });

    modalInstance.result.then(function() {
      $location.path('/admin/layers');
    });
  };

  $scope.addUploadFile = function() {
    $scope.uploads.push({});
  };

  $scope.confirmUpload = function() {
    $scope.uploadConfirmed = true;
  };

  $scope.status = {};
  $scope.$on('uploadComplete', function(e, url, response, index) {
    $scope.status[index] = response.files[0];
    if ($scope.layer.type === 'GeoPackage') {
      $scope.layer.$save({}, function() {
      });
    }
  });

  $scope.geopackagePreview = function(geoPackageFile) {
    if (window.FileReader) {
      var r = new FileReader();

      r.onload = function() {
        var array = new Uint8Array(r.result);
        geopackage.openGeoPackageByteArray(array, function(err, gp) {
          geopackage.getTileTables(gp, function(err, tileTables) {
            $scope.layer.geopackage.tileLayers = tileTables;
            geopackage.getFeatureTables(gp, function(err, featureTables) {
              $scope.layer.geopackage.featureLayers = featureTables;
              $scope.$apply();
            });
          });
        });
      };

      r.readAsArrayBuffer(geoPackageFile);
    }

  }
}
