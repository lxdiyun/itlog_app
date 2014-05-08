/*global require*/
'use strict';

require.config({
	paths: {
		'angular': '../bower_components/angular/angular.min',
		'ngAnimate': '../bower_components/angular-animate/angular-animate.min',
		'lodash': '../bower_components/lodash/dist/lodash.underscore.min',
		'restangular': '../bower_components/restangular/dist/restangular.min',
		'ngTable': '../bower_components/ng-table/ng-table',
		'uiBootstrap': '../bower_components/angular-bootstrap/ui-bootstrap-tpls.min',
		'd3': '../bower_components/d3/d3.min',
		'nvd3': '../bower_components/nvd3/nv.d3.min',
		'ngNvd3': '../bower_components/angularjs-nvd3-directives/dist/angularjs-nvd3-directives'

	},
	shim: {
		'angular': { exports: 'angular' },
		'ngAnimate': { deps:['angular'] },
		'restangular': { deps: ['angular', 'lodash'] },
		'ngTable': { deps: ['angular'] },
		'uiBootstrap': {deps: ['angular']},
		'd3': { exports: 'd3' },
		'nvd3': {deps: ['d3']},
		'ngNvd3': {deps: ['angular', 'nvd3']},
		'services': { deps: ['angular','restangular']},
		'app': {deps: ['angular', 'ngAnimate', 'ngTable', 'uiBootstrap', 'ngNvd3', 'services']}
	}
});

require(['angular', 'app'], function (angular) {
	angular.bootstrap(document, ['itlogApp']);
});
