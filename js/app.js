'use strict';

var itlogApp = angular.module('itlogApp', ['ngAnimate', 'itlogServices', 'ngTable', 'ui.bootstrap']);

itlogApp.run(function($rootScope, RESOURCE_META){
	$rootScope.RESOURCE_META = RESOURCE_META;
});

itlogApp.controller('myContorller', function($scope, $modal, Resource, ngTableParams) {
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
			controller: ModalInstanceCtrl,
			resolve: {
				resource: function () {
					return $scope.selectedResouce;
				}
			}
		});
	};
});

var ModalInstanceCtrl = function($scope, $modalInstance, resource) {
	$scope.resource = resource;

	$scope.close = function () {
		$modalInstance.close();
	};
};
