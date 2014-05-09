'use strict';

var ItlogApp = angular.module('itlogApp', ['ngAnimate', 'itlogServices', 'ngTable', 'ui.bootstrap', 'googlechart']);

ItlogApp.run(function($rootScope, RESOURCE_META){
	$rootScope.RESOURCE_META = RESOURCE_META;
});

ItlogApp.controller('myContorller', function($scope, $modal, Resource, ngTableParams) {
	$scope.tableParams = new ngTableParams({
		page: 1,            // show first page
		count: 10,          // count per page
		sorting: { record_date: 'desc'}
	}, {
		total: 0, // length of data
		getData: function($defer, params) {
			var urlParams = {page:params.page(), page_size: params.count()};

			var sorting = params.sorting();
			var ordering = [];
			for (var key in sorting) {
				var order = sorting[key];
				if (order === 'desc') {
					ordering.push('-' + key);
				}
				else {
					ordering.push(key);
				}
			}
			urlParams['ordering'] = ordering;

			if ($scope.search) {
				urlParams['search'] = $scope.search;
			}

			Resource.getList(urlParams).then(function(data){
				params.total(data.count);
				$defer.resolve(data);
			});
		}
	}); 

	$scope.cleanSearch =  function () {
		$scope.tableParams.page(1);
		$scope.search = '';
		$scope.tableParams.reload();
	};
	$scope.$watch('search', function(newValue, oldValue) {
		if (newValue !== oldValue) {
			$scope.tableParams.page(1);
			$scope.tableParams.reload();
		}
	});

	$scope.open = function (resource) {
		$scope.selectedResouce = resource;
		var modalInstance = $modal.open({
			templateUrl: 'partials/resouce_detail.html',
			controller: DetailCtrl,
			resolve: {
				resource: function () {
					return $scope.selectedResouce;
				}
			}
		});
	};

	$scope.statistics = function () {
		var modalInstance = $modal.open({
			templateUrl: 'partials/statistics.html',
			controller: 'statisticsCtrl',
		});
	};
});

var DetailCtrl = function($scope, $modalInstance, resource) {
	$scope.resource = resource;

	$scope.close = function () {
		$modalInstance.close();
	};
};

ItlogApp.controller('statisticsCtrl', function($scope, $modalInstance) {
	$scope.close = function () {
		$modalInstance.close();
	};

	$scope.cssStyle = "height:600px; width:100%;";

	$scope.chart = {
		"type": "PieChart",
		"displayed": true,
		"data": {
			"cols": [
				{
				"id": "month",
				"label": "Month",
				"type": "string",
				"p": {}
			},
			{
				"id": "laptop-id",
				"label": "Laptop",
				"type": "number",
				"p": {}
			},
			{
				"id": "desktop-id",
				"label": "Desktop",
				"type": "number",
				"p": {}
			},
			{
				"id": "server-id",
				"label": "Server",
				"type": "number",
				"p": {}
			},
			{
				"id": "cost-id",
				"label": "Shipping",
				"type": "number"
			}
			],
			"rows": [
				{
				"c": [
					{
					"v": "January"
				},
				{
					"v": 19,
					"f": "42 items"
				},
				{
					"v": 12,
					"f": "Ony 12 items"
				},
				{
					"v": 7,
					"f": "7 servers"
				},
				{
					"v": 4
				},
				null
				]
			},
			{
				"c": [
					{
					"v": "February"
				},
				{
					"v": 13
				},
				{
					"v": 1,
					"f": "1 unit (Out of stock this month)"
				},
				{
					"v": 12
				},
				{
					"v": 2
				},
				null
				]
			},
			{
				"c": [
					{
					"v": "March"
				},
				{
					"v": 24
				},
				{
					"v": 5
				},
				{
					"v": 11
				},
				{
					"v": 6
				},
				null
				]
			}
			]
		},
		"options": {
			"title": "Sales per month",
			"isStacked": "true",
			"fill": 20,
			"displayExactValues": true,
			"vAxis": {
				"title": "Sales unit",
				"gridlines": {
					"count": 10
				}
			},
			"hAxis": {
				"title": "Date"
			},
			"tooltip": {
				"isHtml": false
			}
		},
		"formatters": {},
		"view": {}
	};

});
