'use strict';

var itlog_app = angular.module('itlog_app', ['ui.bootstrap', 'ngGrid', 'resourceServices']);


itlog_app.controller('my_contorller', ['$scope', 'Resource', function($scope, Resource) {
	$scope.filterOptions = {
		filterText: "",
		useExternalFilter: true
	}; 
	$scope.totalServerItems = 0;
	$scope.pagingOptions = {
		pageSizes: [10, 25, 50],
		pageSize: 10,
		currentPage: 1
	};
	$scope.setPagingData = function(data, page, pageSize){
		//var pagedData = data.slice((page - 1) * pageSize, page * pageSize);
		$scope.myData = data.results;
		$scope.totalServerItems = data.count;
		if (!$scope.$$phase) {
			$scope.$apply();
		}
	};
	$scope.getPagedDataAsync = function (pageSize, page, searchText) {
		setTimeout(function () {
			var data;
			if (searchText) {
				var ft = searchText.toLowerCase();
				//$http.get(api_base + 'resource').success(function (largeLoad) {
					//data = largeLoad.filter(function(item) {
						//return JSON.stringify(item).toLowerCase().indexOf(ft) != -1;
					//});
					//$scope.setPagingData(data,page,pageSize);
				//});            
			} else {
				Resource.query({page_size:pageSize, page:page}, function(result) {
					$scope.setPagingData(result,page,pageSize);
				});
			}
		}, 100);
	};

	$scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage);

	$scope.$watch('pagingOptions', function (newVal, oldVal) {
		if (newVal !== oldVal && newVal.currentPage !== oldVal.currentPage) {
			$scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage, $scope.filterOptions.filterText);
		}
	}, true);
	$scope.$watch('filterOptions', function (newVal, oldVal) {
		if (newVal !== oldVal) {
			$scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage, $scope.filterOptions.filterText);
		}
	}, true);

	$scope.gridOptions = {
		data: 'myData',
		enablePaging: true,
		showFooter: true,
		totalServerItems: 'totalServerItems',
		pagingOptions: $scope.pagingOptions,
		filterOptions: $scope.filterOptions,
		plugins: [new ngGridFlexibleHeightPlugin()]
	};
}]);
