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
	var url			= root.Plankton.url;
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
	Router.prototype.link = function (target, params) {
		params = params || {};
		
		if (is.string(target)) {
			return url.encode(target, params);
		} else if (target instanceof SeaRoute.route.Route) {
			return target.buildPath(params);
		} else {
			throw new Error('target must be Route or string!');
		}
	};
	
	/**
	 * @param {SeaRoute.route.Route|string} target
	 * @param {{}=} params
	 */
	Router.prototype.navigate = function (target, params) {
		this._navigate(this.link(target, params));
	};

	/**
	 * @param {string} url
	 */
	Router.prototype.handle = function (url) {
		PathMatcher.matchArray(this._map, new MatchCursor(url))
	};
	
	
	this.Router = Router;
}); 