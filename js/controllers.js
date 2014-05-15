'use strict';

ITLOG_APP.controller('mainContorller', function($scope, $modal, Resource, ngTableParams) {
	function get_table_data($defer, params) {
		var urlParams = {page:params.page(), page_size: params.count()};
		var sorting = params.sorting();
		var ordering = [];

		for (var filed in $scope.filterDict) {
			var filterString = $scope.filterDict[filed]
			if (filterString && (0 < filterString.length)) {
				urlParams[filed] = filterString;
			}
		}

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

		if ($scope.searchString) {
			urlParams['search'] = $scope.searchString;
		}

		Resource.getList(urlParams).then(function(data){
			params.total(data.count);
			$defer.resolve(data);
		});
	}

	$scope.tableParams = new ngTableParams({ page: 1, count: 10, sorting: { record_date: 'desc'}},
					       { total: 0, getData: get_table_data }); 

	$scope.filterDict = {};
	$scope.$watch('filterDict', function(newValue, oldValue) {
		if (JSON.stringify(newValue) !==  JSON.stringify(oldValue)) {
			$scope.tableParams.page(1);
			$scope.tableParams.reload();
		}
	}, true);

	$scope.cleanSearch =  function () {
		$scope.tableParams.page(1);
		$scope.searchString = '';
		$scope.tableParams.reload();
	};
	$scope.$watch('searchString', function(newValue, oldValue) {
		$scope.tableParams.page(1);
		$scope.tableParams.reload();
	});

	$scope.open = function (resource) {
		$scope.selectedResouce = resource;
		var modalInstance = $modal.open({
			templateUrl: 'partials/resouce_detail.html',
			controller: DetailCtrl,
			resolve: {
				resource: function () { return $scope.selectedResouce; }
			}
		});
	};

	$scope.statistics = function () {
		var modalInstance = $modal.open({
			templateUrl: 'partials/statistics.html',
			controller: 'statisticsCtrl',
			size: "lg",
			resolve: {
				filterDict: function () { return $scope.filterDict; },
				searchString: function () { return $scope.searchString; }
			}
		});
	};

});

var DetailCtrl = function($scope, $modalInstance, resource) {
	$scope.resource = resource;

	$scope.close = function () {
		$modalInstance.close();
	};
};

ITLOG_APP.controller('statisticsCtrl', function($scope, $modalInstance, ResourceStatistic, filterDict, searchString) {
	var CHART_INIT = {
		options: { 
			chart: { type: 'spline' },
			plotOptions: { series: {
				allowPointSelect: true,
				cursor: 'pointer',  
				point: { events: { select: select_chart }},  
			}}
		},
		series: [],
		title: { text: '数量与年份' },
		yAxis: { title: { text: '值' }},
		xAxis: { title: { text: '年份' }},
		loading: true,
	};

	var SELECTED_CHART_INIT = {
		options: { chart: { type: 'pie' }},
		series: [],
		title: { text: '数量与种类' },
		yAxis: { title: { text: '值' }},
		xAxis: { title: { text: '种类' }},
		loading: true,
	};

	function select_chart(e) {
		var year = this.name;
		if (year) {
			var chart = $scope.selectedChartConfig;
			var itemsCount = $scope.orignalData.rows[year];
			var data = [];
			for (var item in itemsCount) {
				if ("count" != item) {
					var count = itemsCount[item];
					data.push([item + " X " + count, count]);
				}
			}

			chart.series = [{name: '数量', data: data}];
			chart.title.text =  year + "年数量与种类统计(总数:" + itemsCount.count + ")"
			chart.loading = false;

			$scope.selectedYear = year;

			$scope.$digest();
		}
	};

	$scope.chartConfig = CHART_INIT;
	$scope.selectedChartConfig = SELECTED_CHART_INIT;

	$scope.close = function () {
		$modalInstance.close();
	};

	var urlParams = {};
	for (var filed in filterDict) {
		var filterString = filterDict[filed]
		if (filterString && (0 < filterString.length)) {
			urlParams[filed] = filterString;
		}
	}

	if (searchString) {
		urlParams['search'] = searchString;
	}

	ResourceStatistic.getList(urlParams).then(function (data){
		var chart = $scope.chartConfig;
		var rows = data.orignalData.rows;
		var countData = [];
		var categories = [];

		$scope.orignalData = data.orignalData;

		for (var year in rows) {
			categories.push(year);
			countData.push([year, rows[year].count]);
		}

		chart.xAxis = {categories: categories};
		chart.series = [{name: '数量', data: countData }];
		chart.loading = false;
	});
});
