/*global require*/
'use strict';

require.config({
	paths: {
		'angular': '../bower_components/angular/angular.min',
		'ngAnimate': '../bower_components/angular-animate/angular-animate.min',
		'lodash': '../bower_components/lodash/dist/lodash.underscore.min',
		'restangular': '../bower_components/restangular/dist/restangular.min',
		'ngTable': '../bower_components/ng-table/ng-table',
		'uiBootstrap': '../bower_components/angular-bootstrap/ui-bootstrap-tpls.min'

	},
	shim: {
		'angular': { exports: 'angular' },
		'ngAnimate': { deps:['angular'] },
		'restangular': { deps: ['angular', 'lodash'] },
		'ngTable': { deps: ['angular'] },
		'uiBootstrap': {deps: ['angular']},
		'services': { deps: ['angular','restangular']},
		'app': {deps: ['angular', 'ngAnimate', 'services', 'ngTable', 'uiBootstrap']}
	}
});

require(['angular', 'app'], function (angular) {
	angular.bootstrap(document, ['itlogApp']);
});
