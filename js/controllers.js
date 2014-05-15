'use strict';

ITLOG_APP.controller('mainContorller', function($scope, $modal, Resource, ngTableParams) {
	$scope.tableParams = new ngTableParams({ page: 1, count: 10, sorting: { record_date: 'desc'}},
					       { total: 0, getData: get_table_data }); 

	$scope.filterDict = {};
	$scope.$watch('filterDict', function(newValue, oldValue) {
		if (JSON.stringify(newValue) !==  JSON.stringify(oldValue)) {
			$scope.tableParams.page(1);
			$scope.tableParams.reload();
		}
	}, true);


	$scope.needTableScroll = false;
	$scope.$watch(function (){ return document.getElementById('table').clientWidth; }, function(newValue, oldValue) {
		var tableDivWidth = $('#table-div').width();
		var tableWidth = newValue;
		if (tableWidth > tableDivWidth) {
			$scope.needTableScroll = true;
		}
		else {
			$scope.needTableScroll = false;
		}
	});

	$scope.cleanSearch =  function () {
		$scope.tableParams.page(1);
		$scope.search = '';
		$scope.tableParams.reload();
	};
	$scope.$watch('search', function(newValue, oldValue) {
		$scope.tableParams.page(1);
		$scope.tableParams.reload();
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
			size: "lg",
		});
	};

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

		if ($scope.search) {
			urlParams['search'] = $scope.search;
		}

		Resource.getList(urlParams).then(function(data){
			params.total(data.count);
			$defer.resolve(data);
		});
	}
});

var DetailCtrl = function($scope, $modalInstance, resource) {
	$scope.resource = resource;

	$scope.close = function () {
		$modalInstance.close();
	};
};

ITLOG_APP.controller('statisticsCtrl', function($scope, $modalInstance, ResourceStatistic) {
	$scope.chartCssStyle = "height:600px; width:100%;";
	$scope.selectedChartCssStyle = "height:400px; width:100%;";

	$scope.close = function () {
		$modalInstance.close();
	};

	$scope.chartConfig = {
		options: { 
			chart: { type: 'bar' },
			plotOptions: { series: {
				allowPointSelect: true,
				cursor: 'pointer',  
				point: { events: { select: select_chart } },  
			} } 
		},
		series: [],
		title: { text: '数量与年份' },
		yAxis: { title: { text: '值' } },
		xAxis: { title: { text: '年份' } },
		loading: true,
	}

	$scope.selectedChartConfig = {
		options: { 
			chart: { type: 'pie' },
		},
		series: [],
		title: { text: '数量与种类' },
		yAxis: { title: { text: '值' } },
		xAxis: { title: { text: '种类' } },
		loading: true,
	}

	ResourceStatistic.getList().then(function (data){
		var chart = $scope.chartConfig;
		$scope.orignalData = data.orignalData;
		var rows = data.orignalData.rows;
		var data = [];
		var categories = [];

		for (var year in rows) {
			categories.push(year);
			data.push([year, rows[year].count]);
		}

		chart.xAxis = {categories: categories};
		chart.series = [{name: '数量', data: data}];
		chart.loading = false;
	});

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
});

var CHART_INIT = {
	"type": "BarChart",
	"displayed": true,
	"data": {
		"cols": [
			{ "id": "year", "label": "年份", "type": "string" },
			{ "id": "count", "label": "数量", "type": "number" }
		],
		"rows": [ ]
	},
	"options": {
		"title": "数量与年份",
		"isStacked": "true",
		"fill": 20,
		"displayExactValues": true,
		"vAxis": { "title": "数量", "gridlines": { "count": 10 } },
		"hAxis": { "title": "年份" },
		"tooltip": { "isHtml": false }
	},
	"formatters": {},
	"view": {}
};

var SELECTED_CHART_INIT = {
	"type": "PieChart",
	"displayed": true,
	"data": {
		"cols": [
			{ "id": "type", "label": "种类", "type": "string" },
			{ "id": "count", "label": "数量", "type": "number" }
		],
		"rows": [ ]
	},
	"options": {
		"title": "数量与种类",
		"isStacked": "true",
		"fill": 20,
		"displayExactValues": true,
		"vAxis": { "title": "数量" },
		"hAxis": { "title": "种类" },
		"tooltip": { "isHtml": false }
	},
	"formatters": {},
	"view": {}
};
