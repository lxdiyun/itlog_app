/*global require*/
'use strict';

require.config({
	paths: {
		'angular': '../bower_components/angular/angular.min',
		'lodash': '../bower_components/lodash/dist/lodash.underscore.min',
		'restangular': '../bower_components/restangular/dist/restangular.min',
		'ngTable': '../bower_components/ng-table/ng-table'

	},
	shim: {
		'angular': { exports: 'angular' },
		'restangular': { deps: ['angular', 'lodash'] },
		'ngTable': { deps: ['angular'] },
		'services': { deps: ['angular','restangular']},
		'app': {deps: ['angular', 'services']}
	}
});

require(['angular', 'lodash', 'restangular', 'ngTable', 'services', 'app'], function (angular) {
	angular.bootstrap(document, ['itlogApp']);
});
