require('../../../namespace').namespace('SeaRoute.route.utils', function(root) {
	'use strict';
	
	
	var is		= root.Plankton.is;
	var array	= root.Plankton.array;
	
	var Route		= root.SeaRoute.route.Route;
	var MapCursor	= root.SeaRoute.route.utils.MapCursor;
	
	
	/**
	 * @name SeaRoute.route.utils.Mapper
	 */
	var Mapper = {

		/**
		 * @param {*} element
		 * @param {SeaRoute.route.utils.MapCursor} cursor
		 * @return {null|*}
		 */
		mergeWithElement: function (element, cursor) {
			if (cursor.EOP) {
				return false;
			} else if (element instanceof Route) {
				return Mapper.mergeWithRoute(element, cursor);
			} else if (is.array(element)) {
				return Mapper.mergeWithArray(element, cursor);
			} else if (is.object(element)) {
				return Mapper.mergeWithMap(element, cursor);
			} else {
				throw 'Unexpected element: ' + element.toString();
			}
		},
		
		/** 
		 * @param {SeaRoute.route.Route} route
		 * @param {SeaRoute.route.utils.MapCursor} cursor
		 * @return {null|*}
		 */
		mergeWithRoute: function (route, cursor) {
			var targetCursor = new MapCursor(route);
			var result = {};
			var chain = result;
			
			if (!targetCursor.goto(cursor.index) || targetCursor.EOP) {
				return false;
			}
			
			while (targetCursor.current === cursor.current && !targetCursor.EOP && !cursor.EOP) {
				var newChainTip = {};
				chain[targetCursor.current] = newChainTip;
				chain = newChainTip;
				
				targetCursor.forward();
				cursor.forward();
			}
			
			chain[targetCursor.current] = route;
			chain[cursor.current] = cursor.route;
				
			return result;
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