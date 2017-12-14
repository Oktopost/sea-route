namespace('SeaRoute.Route.Utils', function(root) {
	'use strict';
	
	
	var is = root.Plankton.is;
	
	var Route		= root.SeaRoute.Route.Route;
	var MapCursor	= root.SeaRoute.Route.Utils.MapCursor;
	
	
	/**
	 * @name SeaRoute.Route.Utils.Mapper
	 */
	var Mapper = {
		
		/**
		 * @param {*} element
		 * @param {SeaRoute.Route.Utils.MapCursor} cursor
		 * @return {null|*}
		 */
		mergeWithElement: function (element, cursor) {
			if (element instanceof Route) {
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
		 * @param {SeaRoute.Route.Route} route
		 * @param {SeaRoute.Route.Utils.MapCursor} cursor
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
			
			if (result !== false)
			{
				chain[currentKey] = chainTip;
			}
			else
			{
				result = chainTip;
			}
			
			cursor.goto(index);
			
			return result;
		},

		/**
		 * @param {*} map
		 * @param {SeaRoute.Route.Utils.MapCursor} cursor
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
		 * @param {SeaRoute.Route.Utils.MapCursor} cursor
		 */
		mergeWithArray: function (set, cursor) {
			var element = cursor.getCompareElement(set);
			var mergeResult = Mapper.mergeWithElement(element, cursor);
			
			if (mergeResult === false) {
				cursor.addRoute(set, cursor.route);
			} else if (mergeResult !== element) {
				set[cursor.getCompareElementIndex(set)] = mergeResult;
			}
			
			return set;
		}
	};
	
	
	this.Mapper = Mapper;
});