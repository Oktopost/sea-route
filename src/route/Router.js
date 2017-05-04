require('../../namespace').namespace('SeaRoute.route', function(root) {
	'use strict';
	
	
	var is		= root.Plankton.is;
	var obj		= root.Plankton.obj;
	var array	= root.Plankton.array;
	
	var Route		= root.SeaRoute.route.Route;
	var Cursor		= root.SeaRoute.route.utils.Cursor;
	var PathMatcher	= root.SeaRoute.route.utils.PathMatcher;
	
	
	/**
	 * @class SeaRoute.route.Router
	 * 
	 * @property {[]}	_map
	 * @property {SeaRoute.route.Route[]} _routes
	 */
	var Router = function () {
		this._map = [];
		this._routes = [];
	};


	/**
	 * @param {SeaRoute.route.Route} route
	 * @private
	 */
	Router.prototype._extractConstPrefix = function (route) {
		var prefix = [];
		
		array.forEach(route.path().parts(),
			/**
			 * @param {SeaRoute.route.Part} part
			 */
			function (part) {
				if (!part.isConst()) {
					return false;
				}
				
				prefix.push(part.text());
			}
		);
		
		return prefix;
	};
	
	
	/**
	 * @return {SeaRoute.route.Route[]}
	 */
	Router.prototype.routes = function () {
		return this._routes;
	};

	/**
	 * @param {SeaRoute.route.Route} route
	 * @return {SeaRoute.route.Router}
	 */
	Router.prototype.append = function (route) {
		return this;
	};
	
	/**
	 * @param {SeaRoute.route.Route} route
	 */
	Router.prototype.prepend = function (route) {
		return this;
	};

	/**
	 * @param {string} path
	 */
	Router.prototype.handle = function(path) {
		PathMatcher.matchArray(this._map, new Cursor(path));
	};
	
	
	this.Router = Router;
});