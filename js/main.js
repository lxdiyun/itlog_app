/*global require*/
'use strict';

require.config({
	paths: {
		'jquery': '../bower_components/jquery/dist/jquery.min',
		'angular': '../bower_components/angular/angular.min',
		'ngCookies': '../bower_components/angular-cookies/angular-cookies.min',
		'ngAnimate': '../bower_components/angular-animate/angular-animate.min',
		'lodash': '../bower_components/lodash/dist/lodash.underscore.min',
		'restangular': '../bower_components/restangular/dist/restangular.min',
		'ngTable': '../bower_components/ng-table/ng-table',
		'uiRoute': '../bower_components/angular-ui-router/release/angular-ui-router.min',
		'uiBootstrap': '../bower_components/angular-bootstrap/ui-bootstrap-tpls.min',
		'highcharts': '../bower_components/highcharts-release/highcharts',
		'highcharts-export': '../bower_components/highcharts-release/modules/exporting',
		'highcharts-ng': '../bower_components/highcharts-ng/dist/highcharts-ng.min',
	},
	shim: {
		'angular': { exports: 'angular' },
		'ngCookies': { deps:['angular'] },
		'ngAnimate': { deps:['angular'] },
		'restangular': { deps: ['angular', 'lodash'] },
		'ngTable': { deps: ['angular'] },
		'uiRoute': {deps: ['angular']},
		'uiBootstrap': {deps: ['angular']},
		'highcharts-export': {deps: ['highcharts']},
		'highcharts-ng': {deps: [ 'jquery', 'highcharts', 'highcharts-export']},
		'services': { deps: ['angular','restangular']},
		'controllers': { deps: ['app']},
		'app': {deps: ['angular', 'ngCookies', 'ngAnimate', 'ngTable', 'uiRoute', 'uiBootstrap', 'highcharts-ng', 'services']}
	}
});

require(['angular', 'app', 'controllers'], function (angular) {
	angular.bootstrap(document, ['itlogApp']);
});
