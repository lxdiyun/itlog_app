/*global require*/
'use strict';

require.config({
	paths: {
		'jquery': '../bower_components/jquery/dist/jquery.min',
		'angular': '../bower_components/angular/angular.min',
		'ngAnimate': '../bower_components/angular-animate/angular-animate.min',
		'ngRoute': '../bower_components/angular-route/angular-route.min',
		'ngResource': '../bower_components/angular-resource/angular-resource.min',
		'ngTable': '../bower_components/ng-table/ng-table',
		'highcharts': '../bower_components/highcharts-release/highcharts',
		'highcharts-export': '../bower_components/highcharts-release/modules/exporting',
		'highcharts-ng': '../bower_components/highcharts-ng/dist/highcharts-ng.min',
	},
	shim: {
		'angular': { exports: 'angular' },
		'ngAnimate': { deps:['angular'] },
		'ngRoute': { deps:['angular'] },
		'ngResource': { deps:['angular'] },
		'ngTable': { deps: ['angular'] },
		'highcharts-export': {deps: ['highcharts']},
		'highcharts-ng': {deps: [ 'jquery', 'angular', 'highcharts', 'highcharts-export']},
		'services': { deps: ['angular','ngResource']},
		'controllers': { deps: ['app']},
		'app': {deps: ['angular', 'ngAnimate', 'ngRoute', 'ngTable', 'highcharts-ng', 'services']}
	}
});

require(['angular', 'app', 'controllers'], function (angular) {
	angular.bootstrap(document, ['itlogApp']);
});
