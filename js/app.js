'use strict';

var ItlogApp = angular.module('itlogApp', ['ngAnimate', 'itlogServices', 'ngTable', 'ui.bootstrap', 'nvd3ChartDirectives']);

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

	$scope.exampleData = [
		{ key: "One", y: 5, x: 1 },
		{ key: "Two", y: 2, x: 1 },
		{ key: "Three", y: 9, x: 1 },
		{ key: "Four", y: 7, x: 1 },
		{ key: "Five", y: 4, x: 1 },
		{ key: "Six", y: 3, x: 1 },
		{ key: "Seven", y: 9, x: 1 }
	];
})
