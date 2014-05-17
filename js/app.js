'use strict';

var ITLOG_APP = angular.module('itlogApp', ['ngAnimate', 'ngCookies', 'ngRoute', 'itlogServices', 'ngTable',  'ui.bootstrap', 'highcharts-ng']);

ITLOG_APP.run(function ($rootScope, RESOURCE_META){
	$rootScope.RESOURCE_META = RESOURCE_META;
});

ITLOG_APP.config(function ($routeProvider, $locationProvider) {
	$routeProvider
	.when('/list', {
		templateUrl: "partials/list.html",
		controller: 'mainController'
	})
	.when('/statistics', {
		templateUrl: "partials/statistics.html",
		controller: 'statisticsController',
	})
	.otherwise("/list");
});
