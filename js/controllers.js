'use strict';

/******************************************************************************
 * maincontroller
 * controller for resource list table
 */
ITLOG_APP.controller('mainController', function ($scope, $modal, $timeout, Resource, ngTableParams) {
	// resouce list table get data function
	function getTableData($defer, params) {
		var urlParams = {page:params.page(), page_size: params.count()};
		var sorting = params.sorting();
		var ordering = [];

		var filterDict = $scope.queryParams.filterDict;
		for (var filed in filterDict) {
			var filterString = filterDict[filed];
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

		var searchString = $scope.queryParams.searchString;
		if (searchString) {
			urlParams['search'] = searchString;
		}

		Resource.query(urlParams, function (data){
			params.total(data.count);
			$defer.resolve(data.results);
		});
	}

	// initialize resouce table list
	$scope.tableParams = new ngTableParams({ page: 1, count: 10, sorting: { record_date: 'desc'}},
					       { total: 0, getData: getTableData }); 

	// handling filter
	var filterTimeout;
	$scope.$watchCollection('queryParams.filterDict', function (newValue, oldValue) {
		if (JSON.stringify(newValue) !==  JSON.stringify(oldValue)) {
			if (filterTimeout) {
				$timeout.cancel(filterTimeout);
			}

			// delay 250ms before reload, so won't reload every
			// character typed
			filterTimeout = $timeout(function () {
				$scope.tableParams.page(1);
				$scope.tableParams.reload();
			}, 250);
		}
	});

	// handling search
	var searchTimeout;
	$scope.cleanSearch =  function () {
		$scope.tableParams.page(1);
		$scope.queryParams.searchString = '';
	};
	$scope.$watch('queryParams.searchString', function (newValue, oldValue) {
		if (oldValue !== newValue) {
			if (searchTimeout) {
				$timeout.cancel(searchTimeout);
			}

			// delay 250ms before reload, so won't reload everycharacter
			// typed
			searchTimeout = $timeout(function() {
				$scope.tableParams.page(1);
				$scope.tableParams.reload();
			}, 250);
		}
	});

	// display resouce detail
	$scope.open = function (resource) {
		$scope.selectedResouce = resource;
		var modalInstance = $modal.open({
			templateUrl: 'partials/resouce_detail.html',
			controller: DetailCtrl,
			size: "lg",
			resolve: {
				resource: function () { return $scope.selectedResouce; }
			}
		});
	};
});

/******************************************************************************
 * controller for resource detail modal
 */
var DetailCtrl = function ($scope, $modalInstance, resource) {
	$scope.resource = resource;

	$scope.close = function () {
		$modalInstance.close();
	};
};

/******************************************************************************
 * controller for resouce statist
 */
ITLOG_APP.controller('statisticsController', function ($scope, ResourceStatistic) {
	// initialize base chart
	var COUNT_CHART_INIT = {
		options: { 
			chart: { type: "spline" },
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

	var PRICE_CHART_INIT = {
		options: { 
			chart: { type: "spline" },
			plotOptions: { series: {
				allowPointSelect: true,
				cursor: 'pointer',  
				point: { events: { select: select_chart }},  
			}}
		},
		series: [],
		title: { text: '价格与年份' },
		yAxis: { title: { text: '值' }},
		xAxis: { title: { text: '年份' }},
		loading: true,
	};

	// initialize chart for select
	var SELECTED_COUNT_CHART_INIT = {
		options: { chart: { type: 'pie' }},
		series: [],
		title: { text: '数量与种类' },
		yAxis: { title: { text: '值' }},
		xAxis: { title: { text: '种类' }},
		loading: true,
	};

	var SELECTED_PRICE_CHART_INIT = {
		options: { chart: { type: 'pie' }},
		series: [],
		title: { text: '价格与种类' },
		yAxis: { title: { text: '值' }},
		xAxis: { title: { text: '价格' }},
		loading: true,
	};

	// handling user change base chart style
	$scope.$watch('countChart.options.chart.type', function (newValue, oldValue) {
		$scope.priceChart.options.chart.type = newValue;
	});

	// select special year in the base chart
	function select_chart(e) {
		var year = this.name;
		if (year) {
			var countChart = $scope.selectedCountChart;
			var priceChart = $scope.selectedPriceChart;
			var items = $scope.data[year];
			var countData = [];
			var priceData = [];

			for (var name in items) {
				if ("total" != name) {
					var count = items[name].count;
					var price = items[name].total_price;
					countData.push([name + " X " + count, count]);
					priceData.push([name + ": " + price, parseFloat(price)]);
				}
			}

			countChart.series = [{ name: '数量', data: countData }];
			countChart.title.text =  year + "年数量与种类统计(总数:" + items.total.count + ")"
			countChart.loading = false;

			priceChart.series = [{ name: '价格', data: priceData }];
			priceChart.title.text =  year + "年价格与种类统计(总价:" + items.total.total_price + ")"
			priceChart.loading = false;

			$scope.selectedYear = year;

			$scope.$digest();
		}
	};

	$scope.countChart = COUNT_CHART_INIT;
	$scope.priceChart = PRICE_CHART_INIT;
	$scope.selectedCountChart = SELECTED_COUNT_CHART_INIT;
	$scope.selectedPriceChart = SELECTED_PRICE_CHART_INIT;

	// get resouce statistic data
	var urlParams = {};
	var filterDict = $scope.queryParams.filterDict;
	for (var filed in filterDict) {
		var filterString = filterDict[filed];
		if (filterString && (0 < filterString.length)) {
			urlParams[filed] = filterString;
		}
	}

	var searchString = $scope.queryParams.searchString;
	if (searchString) {
		urlParams['search'] = searchString;
	}

	ResourceStatistic.query(urlParams, function (data) {
		var countChart = $scope.countChart;
		var priceChart = $scope.priceChart;
		var rows = data.results;
		var countData = [];
		var priceData = [];
		var categories = [];

		$scope.data = rows;

		if (rows) {
			for (var year in rows) {
				categories.push(year);
				countData.push([year, rows[year].total.count]);
				priceData.push([year, parseFloat(rows[year].total.total_price)]);
			}

			countChart.xAxis = {categories: categories};
			countChart.series = [{ name: '数量', data: countData }];

			priceChart.xAxis = {categories: categories};
			priceChart.series = [{ name: '价格', data: priceData }];
		}

		countChart.loading = false;
		priceChart.loading = false;
	});
});
