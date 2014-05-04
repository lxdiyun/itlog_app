'use strict';

var resourceServices = angular.module('resourceServices', ['ngResource'])
//var apiBase = "http://192.168.64.128/website/itlog/api/";
var apiBase = "http://127.0.0.1:8000/itlog/api/";

resourceServices.factory('Resource', ['$resource', function($resource) {
	return $resource(apiBase + 'resource/:resourceID',
			 {},
			 { 
				 query: {method:'GET', params:{resourceID:''}, isArray:false}
			 }
			);
}]);
