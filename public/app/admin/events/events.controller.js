angular
  .module('mage')
  .controller('AdminEventsController', AdminEventsController);

AdminEventsController.$inject = ['$scope', '$injector', '$filter', '$timeout', '$q', 'LocalStorageService', 'EventService', 'Event', 'Team', 'Layer'];

function AdminEventsController($scope, $injector, $filter, $timeout, $q, LocalStorageService, EventService, Event, Team, Layer) {
  $scope.token = LocalStorageService.getToken();
  $scope.events = [];
  $scope.teams = [];
  $scope.layers = [];
  $scope.page = 0;
  $scope.itemsPerPage = 15;

  $scope.saveTime = 0;

  var teamsById = {};
  var layersById = {};

  $q.all({teams: Team.query().$promise, layers: Layer.query().$promise, events: Event.query({populate: false}).$promise}).then(function(result) {
    $scope.teams = result.teams;
    teamsById = _.indexBy(result.teams, 'id');

    $scope.layers = result.layers;
    layersById = _.indexBy(result.layers, 'id');

    $scope.events = result.events;
  });

  $scope.fileUploadOptions = {};

  $scope.fieldTypes = [{
    name : 'textfield',
    value : 'Textfield'
  },{
    name : 'email',
    value : 'E-mail'
  },{
    name : 'p***REMOVED***word',
    value : 'P***REMOVED***word'
  },{
    name : 'radio',
    value : 'Radio Buttons'
  },{
    name : 'dropdown',
    value : 'Dropdown List'
  },{
    name : 'date',
    value : 'Date'
  },{
    name : 'geometry',
    value : 'Geometry'
  },{
    name : 'textarea',
    value : 'Text Area'
  },{
    name : 'checkbox',
    value : 'Checkbox'
  },{
    name : 'hidden',
    value : 'Hidden'
  }];

  $scope.newField = {
    "title" : "New field",
    "type" : $scope.fieldTypes[0].name,
    "value" : "",
    "required" : true
  };

  // accordion settings
  $scope.accordion = {}
  $scope.accordion.oneAtATime = true;
  $scope.variants = [];

  $scope.editEvent = function(event) {
    $scope.event = event;
    $scope.add = false;

    $scope.team = {};
    $scope.eventTeams = _.map(event.teamIds, function(teamId) { return teamsById[teamId] });
    $scope.nonTeams = _.filter($scope.teams, function(team) {
      return event.teamIds.indexOf(team.id) === -1;
    });

    $scope.layer = {};
    $scope.eventLayers = _.map(event.layerIds, function(layerId) { return layersById[layerId] });
    $scope.nonLayers = _.filter($scope.layers, function(layer) {
      return event.layerIds.indexOf(layer.id) === -1;
    });

    _.each($scope.event.form.fields, function(field) {
      if (field.name == 'type') {
        $scope.typeField = field;
      }
    });
  }

  $scope.newEvent = function() {
    $scope.event = new Event({
      teamIds: [],
      layerIds: []
    });

    $scope.team = {};
    $scope.eventTeams = [];
    $scope.nonTeams = $scope.teams.slice();

    $scope.layer = {};
    $scope.eventLayers = [];
    $scope.nonLayers = $scope.layers.slice();

    var baseLayer = _.find($scope.layers, function(l) { return l.base; });
    if (baseLayer) {
      $scope.eventLayers.push(baseLayer);
      $scope.event.layerIds.push(baseLayer.id);
      $scope.nonLayers = _.reject($scope.nonLayers, function(l) { return l.id == baseLayer.id; });
    }
  }

  $scope.createEvent = function() {
    $scope.event.$save(function(savedEvent) {
      $scope.events.push(savedEvent);
    });
  }

  $scope.removeEvent = function(event) {
    $scope.events = _.reject($scope.events, function(f) { return f.id == event.id});
  }

  $scope.addTeam = function(team) {
    $scope.team = {};
    $scope.event.teamIds.push(team.id);
    $scope.eventTeams.push(team);
    $scope.nonTeams = _.reject($scope.nonTeams, function(t) { return t.id == team.id; });
    $scope.autoSave();
  }

  $scope.removeTeam = function(team) {
    $scope.event.teamIds = _.reject($scope.event.teamIds, function(teamId) {return teamId == team.id;});
    $scope.eventTeams = _.reject($scope.eventTeams, function(t) { return t.id == team.id;});
    $scope.nonTeams.push(team);
    $scope.autoSave();
  }

  $scope.addLayer = function(layer) {
    $scope.layer = {};
    $scope.event.layerIds.push(layer.id);
    $scope.eventLayers.push(layer);
    $scope.nonLayers = _.reject($scope.nonLayers, function(l) { return l.id == layer.id; });
    $scope.autoSave();
  }

  $scope.removeLayer = function(layer) {
    $scope.event.layerIds = _.reject($scope.event.layerIds, function(layerId) {return layerId == layer.id;});
    $scope.eventLayers = _.reject($scope.eventLayers, function(l) { return l.id == layer.id;});
    $scope.nonLayers.push(layer);
    $scope.autoSave();
  }

  $scope.deletableField = function(field) {
    return field.name.indexOf('field') != -1;
  }

  // create new field button click
  $scope.addNewField = function() {
    // put newField into fields array
    var fields = $scope.event.form.fields;
    var id = fields[fields.length - 1].id + 1;

    $scope.newField.id = id;
    $scope.newField.name = "field" + id;
    $scope.onRequiredChanged($scope.newField);
    fields.push($scope.newField);

    $scope.newField = {
      "title" : "New field",
      "type" : $scope.fieldTypes[0].name,
      "value" : "",
      "required" : true
    };

    $scope.autoSave();
  }

  $scope.moveFieldUp = function(e, fieldToMoveUp) {
    e.stopPropagation();

    // find first non-archived field above me
    // and switch our ids to re-order
    var sortedFields = _.sortBy($scope.event.form.fields, function(field) {
      return field.id;
    });

    var fieldToMoveDown = null;
    for (var i = sortedFields.length - 1; i > 0; i--) {
      var field = sortedFields[i];
      if (field.id < fieldToMoveUp.id && !field.archived) {
        fieldToMoveDown = field;
        break;
      }
    }

    if (fieldToMoveDown) {
      var fieldToMoveDownId = fieldToMoveDown.id;
      fieldToMoveDown.id = fieldToMoveUp.id;
      fieldToMoveUp.id = fieldToMoveDownId;

      $scope.autoSave();
    }
  }

  $scope.moveFieldDown = function(e, fieldToMoveDown) {
    e.stopPropagation();

    // find the first non-archived field below me
    // and switch our ids to re-order
    var sortedFields = _.sortBy($scope.event.form.fields, function(field) {
      return field.id;
    });

    var fieldToMoveUp = null;
    for (var i = 0; i < sortedFields.length; i++) {
      var field = sortedFields[i];
      if (field.id > fieldToMoveDown.id && !field.archived) {
        fieldToMoveUp = field;
        break;
      }
    }

    if (fieldToMoveUp) {
      var fieldToMoveUpId = fieldToMoveUp.id;
      fieldToMoveUp.id = fieldToMoveDown.id;
      fieldToMoveDown.id = fieldToMoveUpId;

      $scope.autoSave();
    }
  }

  var debounceHideSave = _.debounce(function() {
    $scope.$apply(function() {
      $scope.saved = false;
    });
  }, 5000);

  var debouncedAutoSave = _.debounce(function() {
    $scope.$apply(function() {
      if ($scope.event.id) {
        $scope.event.$save({}, function() {
          $scope.saved = true;
          $timeout(function() {
            debounceHideSave();
          });
          console.log($scope.event);
        });
      }
    });
  }, 1000);

  $scope.$on('uploadComplete', function(event, args) {
    $scope.savedTime = Date.now();
  });

  $scope.groupLayerByType = function (layer) {
    return layer.type;
  }

  $scope.autoSave = function() {
    debouncedAutoSave();
  }

  $scope.populateVariants = function(doNotAutoSave) {
    if (!$scope.event.form) return;

    $scope.variantField = _.find($scope.event.form.fields, function(field) {
      return field.name == $scope.event.form.variantField;
    });
    if (!$scope.variantField) {
      // they do not want a variant
      $scope.variants = [];
      $scope.event.form.variantField = null;
      if (!doNotAutoSave) {
        $scope.autoSave();
      }
      return;
    }
    if ($scope.variantField.type == 'dropdown') {
      $scope.variants = $filter('orderBy')($scope.variantField.choices, 'value');
      $scope.showNumberVariants = false;
    } else if ($scope.variantField.type == 'date') {
      $scope.variantField.choices = $scope.variantField.choices || [];
      $scope.variants = $filter('orderBy')($scope.variantField.choices, 'value');
      $scope.showNumberVariants = true;
    }
    if (!doNotAutoSave) {
      $scope.autoSave();
    }
  }

  $scope.$watch('event.form.variantField', function(variantField) {
    if (!variantField) return;

    $scope.populateVariants(true);
  });

  $scope.$watch('event.form.fields', function() {
    if (!$scope.event || !$scope.event.form || !$scope.event.form.fields) return;

    angular.forEach($scope.event.form.fields, function(field) {
      if (field.name == 'type') {
        $scope.typeField = field;
      }
    });
  });

  $scope.$on('uploadFile', function(e, uploadFile) {
    $scope.event.formArchiveFile = uploadFile;
  });

  $scope.variantChanged = function() {
    $scope.populateVariants();
  }

  // deletes particular field on button click
  $scope.deleteField = function (id) {
    var deletedField = _.find($scope.event.form.fields, function(field) { return id == field.id});
    if (deletedField) {
      deletedField.archived = true;
      $scope.populateVariants();
      $scope.autoSave();
    }
  }

  $scope.variantFilter = function(field) {
    return (field.type == 'dropdown' || field.type == 'date') && field.name != 'type';
  }

  $scope.removeVariant = function(variant) {
    $scope.variantField.choices = _.without($scope.variantField.choices, variant);
    $scope.variants = $filter('orderBy')($scope.variantField.choices, 'value');
    $scope.autoSave();
  }

  $scope.addVariantOption = function(min, max) {
    var newOption = {
      "id" : $scope.variantField.choices.length,
      "title" : min,
      "value" : min
    };

    $scope.variantField.choices = $scope.variantField.choices || new Array();
    $scope.variantField.choices.push(newOption);
    $scope.variants = $filter('orderBy')($scope.variantField.choices, 'value');
    $scope.autoSave();
  }

  $scope.addType = function() {
    $scope.addOption($scope.typeField);
    if ($scope.event.id) { $scope.event.$save(); }
  }

  // add new option to the field
  $scope.addOption = function (field, optionTitle) {
    field.choices = field.choices || new Array();
    field.choices.push({
      "id" : field.choices.length,
      "title" : optionTitle,
      "value" : field.choices.length
    });
    $scope.populateVariants();
    $scope.autoSave();
  }

  // delete particular option
  $scope.deleteOption = function (field, option) {
    for (var i = 0; i < field.choices.length; i++) {
      if(field.choices[i].id == option.id) {
        field.choices.splice(i, 1);
        break;
      }
    }
    $scope.populateVariants();
    $scope.autoSave();
  }

  $scope.onRequiredChanged = function(field) {
    if (field.type == 'dropdown') {
      if (field.required && field.choices.length && field.choices[0].blank) {
        field.choices.shift();

        _.each(field.choices, function(choice) {
          choice.id = choice.id - 1;
          choice.value = choice.value - 1;
        });
      } else if (!field.required && field.choices.length > 0  && !field.choices[0].blank) {
        // add empty field
        _.each(field.choices, function(choice) {
          choice.id = choice.id + 1;
          choice.value = choice.value + 1;
        });

        field.choices.unshift({
          id: 0,
          title: "",
          value: 0,
          blank: true
        });
      }
    }
  }

  // decides whether field options block will be shown (true for dropdown and radio fields)
  $scope.showAddOptions = function (field) {
    return (field.type == "radio" || field.type == "dropdown");
  }

  // deletes all the fields
  $scope.reset = function() {
    $scope.event.form.fields.splice(0, $scope.event.form.fields.length);
  }

  $scope.deleteEvent = function() {
    var modalInstance = $injector.get('$modal').open({
      templateUrl: '/app/admin/events/event-delete.html',
      resolve: {
        event: function () {
          return $scope.event;
        }
      },
      controller: ['$scope', '$modalInstance', 'event', function ($scope, $modalInstance, event) {
        $scope.event = event;

        $scope.deleteEvent = function(event, force) {
          console.info('delete event');
          event.$delete(function(success) {
            console.info('event delete success');
            $modalInstance.close(event);
          });
        }
        $scope.cancel = function () {
          $modalInstance.dismiss('cancel');
        };
      }]
    });

    modalInstance.result.then(function (event) {
      console.info('success');
      $scope.event = null;
      $scope.removeEvent(event);
    }, function () {
      console.info('failure');
    });
  }
}
