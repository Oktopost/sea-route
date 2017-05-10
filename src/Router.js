require('../namespace').namespace('SeaRoute', function(root) {
	'use strict';
	
	
	var Params			= root.SeaRoute.Params;
	var RoutesBuilder	= root.SeaRoute.RoutesBuilder;
	var Mapper			= root.SeaRoute.route.utils.Mapper;
	var PathMatcher		= root.SeaRoute.route.utils.PathMatcher;
	var MatchCursor		= root.SeaRoute.route.utils.MatchCursor;
	var MapCursor		= root.SeaRoute.route.utils.MapCursor;
	var Route			= root.SeaRoute.route.Route;
	var Param			= root.SeaRoute.params.Param;
	
	var is			= root.Plankton.is;
	var obj			= root.Plankton.obj;
	var array		= root.Plankton.array;
	var classify	= root.Classy.classify;
	
	
	/**
	 * @class SeaRoute.Router
	 * 
	 * @param {function(string)} navigateCallback
	 * 
	 * @property {SeaRoute.RoutesBuilder}	_builder
	 * @property {function(string)}			_navigate
	 * @property {[]}						_map
	 */
	var Router =  function (navigateCallback) {
		this._map		= [];
		this._builder	= new RoutesBuilder();
		this._navigate	= navigateCallback;
		
		classify(this);
	};


	/**
	 * @param {*|SeaRoute.route.Route} routes
	 * @param {*} cursorCreator
	 * @private
	 */
	Router.prototype._addRoutes = function (routes, cursorCreator) {
		if (routes instanceof Route) {
			Mapper.mergeWithArray(this._set, cursorCreator(routes));
		}
		
		obj.forEach(routes, function (item) {
			this._addRoutes(item, cursorCreator);
		});
	};


	/**
	 * @param {string} url
	 * @param {{}} params
	 * @returns {string}
	 * @private
	 */
	Router.prototype._buildURL = function (url, params) {
		var queryParams = {};
		var link;
		var queryParts = [];
		
		array.forEach(url.split('/'), function (part) {
			link += '/';
			
			if (part[0] === '{' && part[part.length - 1] === '}') {
				link += part;
			} else if (part.length !== 0) {
				link += encodeURI(part);
			}
		});
		
		if (link.length === 0) {
			link = '/';
		}
		
		obj.forEach.pair(params, function (key, value) {
			if (link.indexOf('{' + key + '}') === -1) {
				queryParams = value;
				return;
			}
			
			link.replace('{' + key + '}', encodeURI(value.toString()));
		});
		
		if (!is(queryParams)) {
			return link;
		}
		
		obj.forEach.pair(queryParams, function (key, value) {
			queryParts.push(encodeURI(key) + '=' + encodeURI(value));
		});
		
		return link + '?' + queryParts.join('&');
	};


	/**
	 * @param {{}} params
	 * @return {SeaRoute.Router}
	 */
	Router.prototype.addParams = function (params) {
		this._builder.addParams(params);
		return this;
	};
	
	Router.prototype.appendRoutes = function (routes) {
		routes = this._builder.create(routes);
		Mapper.mergeWithArray(routes, MapCursor.createAppendCursor);
	};

	/**
	 * @param {SeaRoute.route.Route|string} target
	 * @param {{}=} params
	 */
	Router.prototype.navigate = function (target, params) {
		params = params || {};
		
		if (is.string(target)) {
			this._navigate(this._buildURL(target, params));
		} else if (target instanceof SeaRoute.route.Route) {
			this._navigate(target.buildPath(params));
		} else {
			throw new Error('target must be Route or string!');
		}
	};

	/**
	 * @param {string} url
	 */
	Router.prototype.handle = function (url) {
		PathMatcher.matchArray(this._map, new MatchCursor(url))
	};
	
	
	this.Router = Router;
}); 