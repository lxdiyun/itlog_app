'use strict';

var services = angular.module('itlogServices', ['restangular']);

services.config(function(RestangularProvider) {
	RestangularProvider.setBaseUrl("http://192.168.64.128/website/itlog/api/");
	//RestangularProvider.setBaseUrl("http://127.0.0.1:8000/itlog/api/");
	
	RestangularProvider.setRequestSuffix('/');

	RestangularProvider.addResponseInterceptor(function(data, operation, what, url, response, deferred) {
		if (what in DATA_INTERCEPTORS) {
			return DATA_INTERCEPTORS[what](data);
		}
		else {
			return data;
		}
    });
});


services.factory('Resource', function(Restangular){
	return Restangular.service('resource');
});

services.factory('ResourceStatistic', function(Restangular){
	return Restangular.service('resource_statistic');
});

function resouceInterceptor(data) {
	var extractedData = data;
	var results = data.results;
	var count = data.count;

	if (results) {
		extractedData = results;
	}
	if (count) {
		extractedData.count = data.count;
	}

	return extractedData;
}

function resouceStatisticInterceptor(data) {
	var extractedData = [];

	extractedData.orignalData = data;

	return extractedData;
}

var DATA_INTERCEPTORS = {
	'resource': resouceInterceptor,
	'resource_statistic': resouceStatisticInterceptor
};

services.constant('RESOURCE_META',[
	{ title: '序号', field: 'number', visible: false },
	{ title: '资产编号', field: 'sn', visible: true },
	{ title: '分类号', field: 'catalog_id', visible: false, filter: true },
	{ title: '国标号', field: 'national_id', visible: false, filter: true },
	{ title: '资产名称', field: 'name', visible: true, filter: true},
	{ title: '资产型号', field: 'model', visible: true },
	{ title: '资产规格', field: 'specification', visible: true },
	{ title: '单价', field: 'price', visible: true },
	{ title: '机身编号', field: 'sn2', visible: false },
	{ title: '使用部门', field: 'department', visible: false },
	{ title: '用户', field: 'user', visible: false },
	{ title: '保管员', field: 'keeper', visible: false },
	{ title: '单位责任人', field: 'officer', visible: false },
	{ title: '状态', field: 'status', visible: false },
	{ title: '地点', field: 'location', visible: false },
	{ title: '购买日期', field: 'buy_date', visible: true },
	{ title: '经费科目', field: 'funding_source', visible: false },
	{ title: '入账日期', field: 'record_date', visible: true, filter: true },
	{ title: '国家', field: 'country', visible: false },
	{ title: '供应商', field: 'provider', visible: false },
	{ title: '折旧年限', field: 'depreciated_year', visible: false },
	{ title: '已用年数', field: 'used_year', visible: false },
	{ title: '折旧价格', field: 'depreciated_price', visible: false }
]);
