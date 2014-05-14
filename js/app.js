'use strict';

var ITLOG_APP = angular.module('itlogApp', ['ngAnimate', 'itlogServices', 'ngTable', 'ui.bootstrap', 'googlechart', 'highcharts-ng']);

ITLOG_APP.run(function($rootScope, RESOURCE_META){
	$rootScope.RESOURCE_META = RESOURCE_META;
});
