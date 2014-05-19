'use strict';

var ITLOG_APP = angular.module('itlogApp', ['ngAnimate', 'ngRoute', 'itlogServices', 'ngTable', 'highcharts-ng']);

ITLOG_APP.run(function ($rootScope, RESOURCE_META, ngTableParams) {
	$rootScope.RESOURCE_META = RESOURCE_META;
	$rootScope.queryParams = { filterDict: {}, searchString:""};
	$rootScope.tableParams = new ngTableParams({ page: 1, count: 10, sorting: { record_date: 'desc'}}, { total: 0 }); 
	console.log($rootScope.tableParams);
});

ITLOG_APP.config(function ($routeProvider) {
	$routeProvider
	.when('/list', {
		templateUrl: "partials/list.html",
		controller: 'mainController'
	})
	.when('/detail/:resourceID', {
		templateUrl: "partials/resouce_detail.html",
		controller: 'detailController'
	})
	.when('/statistics', {
		templateUrl: "partials/statistics.html",
		controller: 'statisticsController',
	})
	.otherwise({redirectTo: "/list"});
});
