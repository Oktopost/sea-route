require('../../../namespace').namespace('SeaRoute.route.utils', function(root) {
	'use strict';
	
	
	var is = root.Plankton.is;
	
	var MapCursor = root.SeaRoute.route.utils.MapCursor;
	
	
	/**
	 * @name SeaRoute.route.utils.Mapper
	 */
	var Mapper = {

		/**
		 * @param {*} object
		 * @private
		 */
		_isRoute: function (object) {
			return is.defined(object) && is.function(object.path);
		},
		
		
		/**
		 * @param {*} element
		 * @param {SeaRoute.route.utils.MapCursor} cursor
		 * @return {null|*}
		 */
		mergeWithElement: function (element, cursor) {
			if (Mapper._isRoute(element)) {
				return Mapper.mergeWithRoute(element, cursor);
			} else if (is.array(element)) {
				return Mapper.mergeWithArray(element, cursor);
			} else if (cursor.EOP) {
				return false;
			} else if (is.object(element)) {
				return Mapper.mergeWithMap(element, cursor);
			} else {
				throw 'Unexpected object ' + element.toString()
			}
		},
		
		/** 
		 * @param {SeaRoute.route.Route} route
		 * @param {SeaRoute.route.utils.MapCursor} cursor
		 * @return {null|*}
		 */
		mergeWithRoute: function (route, cursor) {
			var targetCursor = new MapCursor(route);
			
			var chain;
			var chainTip;
			var result		= false;
			var currentKey	= '';
			var index		= cursor.index;
			
			if (!targetCursor.goto(cursor.index) || targetCursor.EOP) {
				return false;
			}
			
			while (targetCursor.current === cursor.current && !targetCursor.EOP && !cursor.EOP) {
				if (result === false) {
					result = {};
					chain = result;
				} else {
					chain[currentKey] = {};
					chain = chain[currentKey];
					currentKey = targetCursor.current; 
				}
				
				currentKey = targetCursor.current; 
				
				targetCursor.forward();
				cursor.forward();
			}
			
			if (targetCursor.EOP || cursor.EOP) {
				chainTip = [ route ];
				chainTip = cursor.addRoute(chainTip, cursor.route);
			} else {
				chainTip = {};
				chainTip[targetCursor.current] = route;
				chainTip[cursor.current] = cursor.route;
			}
			
			if (result !== false) {
				result[currentKey] = chainTip;
			} else {
				result = chainTip;
			}
			
			cursor.goto(index);
			
			return (result || chainTip);
		},

		/**
		 * @param {*} map
		 * @param {SeaRoute.route.utils.MapCursor} cursor
		 */
		mergeWithMap: function (map, cursor) {
			if (!is(map[cursor.current])) {
				map[cursor.current] = cursor.route;
			} else {
				var element = map[cursor.current];
				var mergeResult;
				
				cursor.forward();
				mergeResult = Mapper.mergeWithElement(element, cursor);
				cursor.back();
				
				if (mergeResult === false) {
					mergeResult = cursor.addRoute([element], cursor.route);
				}
				
				map[cursor.current] = mergeResult;
			}
			
			return map;
		},


		/**
		 * @param {[]} set
		 * @param {SeaRoute.route.utils.MapCursor} cursor
		 */
		mergeWithArray: function (set, cursor) {
			var element = cursor.getCompareElement(set);
			var mergeResult = Mapper.mergeWithElement(element, cursor);
			
			if (mergeResult === false) {
				cursor.addRoute(set, cursor.route);
			} else if (mergeResult !== element) {
				set[cursor.getCompareElementIndex(set.length - 1)] = mergeResult;
			}
			
			return set;
		}
	};
	
	
	this.Mapper = Mapper;
});