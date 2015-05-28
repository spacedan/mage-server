angular
	.module('mage')
	.factory('Layer', Layer);

Layer.$inject = ['$resource', '$http'];

function Layer($resource, $http) {
	var Layer = $resource('/api/layers/:id', {
		id: '@id'
	},{
		create: {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			}
		},
		update: {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json'
			}
		},
		queryByEvent: {
			method: 'GET',
			isArray: true,
			url: '/api/events/:eventId/layers'
		}
	});

	Layer.prototype.$save = function(params, success, error) {
		if (this.type == 'Feature') {
      delete this.base;
      delete this.format;
      delete this.wms;
    } else if (this.type == 'Imagery') {
      if (this.format != 'WMS') {
        delete this.wms;
      }
    }

		if(this.id) {
			this.$update(params, success, error);
		} else {
			this.$create(params, success, error);
		}
	};

	return Layer;

}