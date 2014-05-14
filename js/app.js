'use strict';

var ItlogApp = angular.module('itlogApp', ['ngAnimate', 'itlogServices', 'ngTable', 'ui.bootstrap', 'googlechart']);

ItlogApp.run(function($rootScope, RESOURCE_META){
	$rootScope.RESOURCE_META = RESOURCE_META;
});

ItlogApp.controller('mainContorller', function($scope, $modal, Resource, ngTableParams) {
	$scope.filterDict = {};
	$scope.$watch('filterDict', function(newValue, oldValue) {
		if (JSON.stringify(newValue) !==  JSON.stringify(oldValue)) {
			$scope.tableParams.page(1);
			$scope.tableParams.reload();
		}
	}, true);
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

			for (var filed in $scope.filterDict) {
				urlParams[filed] = $scope.filterDict[filed];
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

	$('.test').resize(function () {
		console.log("jquery check ");
		var tableWidth = $("#table").width();
		console.log("jquery check " + tableWidth);
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
});

var DetailCtrl = function($scope, $modalInstance, resource) {
	$scope.resource = resource;

	$scope.close = function () {
		$modalInstance.close();
	};
};

ItlogApp.controller('statisticsCtrl', function($scope, $modalInstance, ResourceStatistic) {
	$scope.close = function () {
		$modalInstance.close();
	};

	ResourceStatistic.getList().then(function (data){
		$scope.chart.data.rows = data;
		$scope.chart.orignalData = data.orignalData;
	});

	$scope.chartCssStyle = "height:600px; width:100%;";
	$scope.selectedChartCssStyle = "height:400px; width:100%;";

	$scope.chart = {
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

	$scope.selectedChart = {
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

	$scope.selected = function (selectedItem) {
		var year = $scope.chart.data.rows[selectedItem.row].c[0].v;
		var chart = $scope.selectedChart;
		var itemsCount = $scope.chart.orignalData.rows[year];
		var rows = [];
		for (var item in itemsCount) {
			if ("count" != item) {
				rows.push({c: [
					{"v": item + " X " + itemsCount[item] },
					{"v": itemsCount[item]}
				]});
			}
		}
		chart.data.rows = rows;
		chart.options.title =  year + "年数量与种类统计(总数:" + itemsCount.count + ")"
		$scope.selectedItem = selectedItem;
	};
});
