require('../namespace').namespace('SeaRoute', function(root) {
	'use strict';
	
	
	var Route		= root.SeaRoute.route.Route;
	var RouteParser = root.SeaRoute.parsers.RouteParser;
	
	var is			= root.Plankton.is;
	var obj			= root.Plankton.obj;
	var array		= root.Plankton.array;
	var classify	= root.Classy.classify;
	
	
	/**
	 * @class SeaRoute.RoutesBuilder
	 * 
	 * @param {{}=} predefinedParams
	 * 
	 * @property {{}} _predefinedParams
	 */
	var RoutesBuilder =  function (predefinedParams) {
		this._predefinedParams = predefinedParams || {};
		
		classify(this);
	};


	/**
	 * @param {[]} data
	 * @return {[]}
	 * @private
	 */
	RoutesBuilder.prototype._handleArray = function (data) {
		var result = [];
		var self = this;
		
		array.forEach(data, function (item) {
			result.push(self.create(item));
		});
		
		return result;
	};

	/**
	 * @param {string} path
	 * @param {*} b
	 * @param {*} c
	 * @return {Route}
	 * @private
	 */
	RoutesBuilder.prototype._handleSingleRouteFromParams = function (path, b, c) {
		var obj = { path: path };
		
		if (is.function(b)) {
			obj.callback = b;
		} else if (is.function(c)) {
			obj.callback = c;
		} else if (!is.object(b) || !is.function(b.callback)) {
			throw new Error('Callback must be set!');
		} else {
			if (is.defined(b.params)) {
				obj.params = b.params;
			}
			
			obj.callback = b.callback;
		}
		
		return this.create(obj);
	};

	/**
	 * 
	 * @param {{}} data
	 * @param {function} callback
	 * @return {{Route}}
	 * @private
	 */
	RoutesBuilder.prototype._handleFromObjectAndCallback = function (data, callback) {
		if (!is.string(data.path)) {
			throw new Error('Path must be set!'); 
		}
		
		return this.create({
			path:		data.path,
			params:		data.params || {},
			callback:	callback
		});
	};
	
	/**
	 * 
	 * @param {{}} data
	 * @return {{}}
	 * @private
	 */
	RoutesBuilder.prototype._handleFromMap = function (data) {
		var result = {};
		var self = this;
		
		obj.forEach.pair(data, function (key, value) {
			if (is.function(value.callback) && !is.string(value.path)) {
				value.path = key;
			}
			
			result[key] = self.create(value);
		});
		
		return result;
	};

	/**
	 * @param {*} data
	 * @param {function=} b
	 * @return {Route[]|{Route}}
	 * @private
	 */
	RoutesBuilder.prototype._handleFromObject = function (data, b) {
		if (is.function(b)) {
			return this._handleFromObjectAndCallback(data, b);
		} else if (is.function(data.callback)) {
			return RouteParser.parse(data, this._predefinedParams);
		} else {
			return this._handleFromMap(data);
		}
	};


	/**
	 * @param {string|{}|[]} a
	 * @param {*=} b
	 * @param {*=} c
	 * @return {[Route]|{Route}|Route}
	 */
	RoutesBuilder.prototype.create = function (a, b, c) {
		// Single route.
		if (a instanceof Route) {
			return a;
			
		// Array of elements.
		} else if (is.array(a)) {
			return this._handleArray(a);
			
		// First parameter is path.
		} else if (is.string(a)) {
			return this._handleSingleRouteFromParams(a, b, c); 
		
		// First parameter is object.
		} else if (is.object(a)) {
			return this._handleFromObject(a, b);
		
		// Else it's an error
		} else {
			throw new Error('Unexpected parameter passed!');
		}
	};
	
	
	this.RoutesBuilder = RoutesBuilder;
});