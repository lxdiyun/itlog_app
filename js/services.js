'use strict';

var services = angular.module('itlogServices', ['restangular']);

services.factory('Resource', function(Restangular){
	return Restangular.service('resource');
});

services.config(function(RestangularProvider) {
	RestangularProvider.setBaseUrl("http://192.168.64.128/website/itlog/api/");
	//RestangularProvider.setBaseUrl("http://127.0.0.1:8000/itlog/api/");

	RestangularProvider.addResponseInterceptor(function(data, operation, what, url, response, deferred) {
		var extractedData;
		// .. to look for getList operations
		if (operation === "getList") {
			extractedData = data.results;
			extractedData.count = data.count;
		} else {
			extractedData = data;
		}
		return extractedData;
    });

});
