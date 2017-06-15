namespace('SeaRoute.Route', function(root) {
	'use strict';
	
	
	var is		= root.Plankton.is;
	var as		= root.Plankton.as;
	var obj		= root.Plankton.obj;
	var array	= root.Plankton.array;
	
	
	/**
	 * @class SeaRoute.Route.Query
	 * 
	 * @property {SeaRoute.ParamType.Param[]} 	_params
	 * @property {boolean}					_isStrict
	 */
	var Query = function () {
		this._params = [];
		this._isStrict = false;
	};
	
	
	/**
	 * @param {*} query
	 * @param {SeaRoute.ParamType.Param} param
	 * @param {*} data
	 * @return {*}
	 */
	Query.prototype._queryToParam = function (query, param, data) {
		if (!is(query[param.name()])) {
			if (param.hasDefaultValue()) {
				data[param.name()] = param.defaultValue();
			} else if (!param.isOptional()) {
				throw 'Missing query parameter ' + param.name();
			}
		} else {
			data[param.name()] = param.extract(query[param.name()]);
		}
	};
	
	/**
	 * @param {*} query
	 * @return {*}
	 */
	Query.prototype._queryToParams = function (query) {
		var data = {};
		var self = this;
		
		array.forEach(this._params,
			function (param) {
				self._queryToParam(query, param, data);
			});
		
		return data;
	};
	
	/**
	 * @param {*} values
	 * @param {SeaRoute.ParamType.Param} param
	 * @param {*} data
	 * @return {*}
	 */
	Query.prototype._paramToQuery = function (values, param, data) {
		if (!is(values[param.name()])) {
			if (param.isAutoFillURL()) {
				data[param.name()] = param.encode(param.defaultValue());
			} else if (!param.isOptional()) {
				throw 'Value of parameter ' + param.name() + ' not passed';
			}
		} else {
			data[param.name()] = param.encode(values[param.name()]);
		}
	};
	
	/**
	 * @param {*} values
	 * @return {*}
	 */
	Query.prototype._paramsToQuery = function (values) {
		var data = {};
		var self = this;
		
		array.forEach(this._params,
			function (param) {
				self._paramToQuery(values, param, data);
			});
		
		return data;
	};
	
	
	/**
	 * @return {boolean}
	 */
	Query.prototype.isEmpty = function () {
		return !is(this._params);
	};
	
	/**
	 * @return {Number}
	 */
	Query.prototype.count = function () {
		return this._params.length;
	};
	
	/**
	 * @return {SeaRoute.Route.Query}
	 */
	Query.prototype.setStrict = function () {
		this._isStrict = true;
		return this;
	};
	
	/**
	 * @param {SeaRoute.ParamType.Param[]|SeaRoute.ParamType.Param} params
	 * @return {SeaRoute.Route.Query}
	 */
	Query.prototype.add = function (params) {
		params = as.array(params);
		this._params = this._params.concat(params);
		return this;
	};


	/**
	 * @param {*} query
	 * @return {*}
	 */
	Query.prototype.parseQuery = function (query) {
		var data = this._queryToParams(query);
		
		if (!this._isStrict) {
			obj.forEach.pair(query, function(name, value) {
				if (!data.hasOwnProperty(name)) {
					data[name] = value;
				}
			});
		}
		
		return data;
	};
	
	/**
	 * @param {*} query
	 * @return {*}
	 */
	Query.prototype.parseParameters = function (query) {
		var data = this._paramsToQuery(query);
		
		if (this._isStrict) {
			obj.forEach.key(query, function(name) {
				if (!data.hasOwnProperty(name)) {
					throw 'Parameter named ' + name + ' is not defined';
				}
			});
		}
		
		return data;
	};
	
	
	this.Query = Query;
});