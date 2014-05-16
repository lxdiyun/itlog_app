'use strict';

var ITLOG_APP = angular.module('itlogApp', ['ngAnimate', 'ngCookies', 'itlogServices', 'ngTable', 'ui.router', 'ui.bootstrap', 'highcharts-ng']);

ITLOG_APP.run(function ($rootScope, RESOURCE_META){
	$rootScope.RESOURCE_META = RESOURCE_META;
});

ITLOG_APP.config(function ($stateProvider, $urlRouterProvider) {
	$urlRouterProvider.otherwise("/list");

	$stateProvider
	.state('list', {
		url: "/list",
		templateUrl: "partials/list.html",
		controller: 'mainController'
	})
	.state('statistics', {
		url: "/statistics",
		templateUrl: "partials/statistics.html",
		controller: 'statisticsController',
	})
});
