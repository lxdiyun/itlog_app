'use strict';

var ITLOG_APP = angular.module('itlogApp', ['ngAnimate', 'ngRoute', 'itlogServices', 'ngTable',  'ui.bootstrap', 'highcharts-ng']);

// Initialize rootscope 
ITLOG_APP.run(function ($rootScope, RESOURCE_META){
	$rootScope.RESOURCE_META = RESOURCE_META;
	$rootScope.queryParams = { filterDict: {}, searchString:""};
});

ITLOG_APP.config(function ($routeProvider) {
	// Initialize route
	$routeProvider
	.when('/list', {
		templateUrl: "partials/list.html",
		controller: 'mainController'
	})
	.when('/statistics', {
		templateUrl: "partials/statistics.html",
		controller: 'statisticsController',
	})
	.otherwise({redirectTo: "/list"});
});
