var itlog_app = angular.module('itlog_app', ['ui.bootstrap', 'ngGrid']);

var api_base = "http://192.168.64.128/website/itlog/api/";

itlog_app.controller('my_contorller', function($scope, $http) {
	$scope.filterOptions = {
		filterText: "",
		useExternalFilter: true
	}; 
	$scope.totalServerItems = 0;
	$scope.pagingOptions = {
		pageSizes: [250, 500, 1000],
		pageSize: 250,
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
				$http.get(api_base + 'resource').success(function (largeLoad) {
					data = largeLoad.filter(function(item) {
						return JSON.stringify(item).toLowerCase().indexOf(ft) != -1;
					});
					$scope.setPagingData(data,page,pageSize);
				});            
			} else {
				$http.get(api_base + 'resource').success(function (largeLoad) {
					$scope.setPagingData(largeLoad,page,pageSize);
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
		filterOptions: $scope.filterOptions
	};
});
