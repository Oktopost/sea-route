require('../../../namespace').namespace('SeaRoute.route.utils', function(root) {
	'use strict';
	
	
	var is			= root.Plankton.is;
	var array		= root.Plankton.array;
	
	var Cursor = root.SeaRoute.route.utils.Cursor;
	
	
	/**
	 * @class SeaRoute.route.utils.MapCursor
	 * 
	 * @property {function([], *): []|undefined} addRoute
	 * @property {function([]): *|undefined} getCompareElement
	 * @property {function([]): Number|undefined} getCompareElementIndex
	 * 
	 * @param {SeaRoute.route.Route} route
	 */
	var MapCursor = function(route) {
		var self = this;
		
		this.route		= route;
		this.rawParts	= [];
		this.index		= 0;
		this.EOP		= false;
		this.current	= false;
		
		
		array.forEach(route.path().parts(),
			/**
			 * @param {SeaRoute.route.Part} part
			 */
			function (part) {
				if (!part.isConst()) {
					return false;
				}
				
				self.rawParts.push(part.text());
			}
		);
		
		
		this.EOP		= this.rawParts.length === 0;
		this.current	= is(this.rawParts) ? this.rawParts[0] : false;
	};
	
	
	MapCursor.prototype.forward = function () {
		this.goto(this.index + 1);
	};
	
	MapCursor.prototype.back = function () {
		this.goto(this.index - 1);
	};
	
	MapCursor.prototype.goto = function (index) {
		if (this.rawParts.length < index) {
			return false;
		}
		
		this.index		= index;
		this.EOP		= (this.index === this.rawParts.length);
		this.current	= (this.EOP ? false : this.rawParts[this.index]);
	};


	/**
	 * @param {SeaRoute.route.Route} route
	 * @return {SeaRoute.route.utils.MapCursor}
	 */
	MapCursor.createAppendCursor = function (route) {
		var cursor = new MapCursor(route);
		
		cursor.getCompareElement = function (arr) { return arr[arr.length - 1]; };
		cursor.getCompareElementIndex = function (arr) { return arr.length - 1; };
		cursor.addRoute = function (arr, element) { arr.push(element); return arr; };
		
		return cursor;
	};

	/**
	 * @param {SeaRoute.route.Route} route
	 * @return {SeaRoute.route.utils.MapCursor}
	 */
	MapCursor.createPrependCursor = function (route) {
		var cursor = new MapCursor(route);
		
		cursor.getCompareElement = function (arr) { return arr[0]; };
		cursor.getCompareElementIndex = function (arr) { return arr.length - 1; };
		cursor.addRoute = function (arr, element) { arr.unshift(element); return arr; }
		
		return cursor;
	};
	
	
	this.MapCursor = MapCursor;
});