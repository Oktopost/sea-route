require('../../../namespace').namespace('SeaRoute.route.utils', function(root) {
	'use strict';
	
	
	var is		= root.Plankton.is;
	var array	= root.Plankton.array;
	
	var Route	= root.SeaRoute.route.Route;
	
	
	/**
	 * @name SeaRoute.route.utils.PathMatcher
	 */
	var PathMatcher = {

		/**
		 * @param {*} element
		 * @param {SeaRoute.route.utils.MatchCursor} cursor
		 * @return {boolean}
		 */
		matchElement: function (element, cursor) {
			if (element instanceof Route) {
				return PathMatcher.matchRoute(element, cursor);
			} else if (is.array(element)) {
				return PathMatcher.matchArray(element, cursor);
			} else if (is.object(element)) {
				return PathMatcher.matchMap(element, cursor);
			} else {
				throw 'Unexpected element: ' + element.toString();
			}
		},
		
		/**
		 * @param {SeaRoute.route.Route} route
		 * @param {SeaRoute.route.utils.MatchCursor} cursor
		 * @return {boolean}
		 */
		matchRoute: function (route, cursor) {
			if (route.isMatching(cursor.rawParts)) {
				route.handle(cursor.rawParts, cursor.rawQuery);
				return true;
			}
			
			return false;
		},
		
		/**
		 * @param {[]} set
		 * @param {SeaRoute.route.utils.MatchCursor} cursor
		 * @return {boolean}
		 */
		matchArray: function (set, cursor) {
			var result = false;
			
			array.forEach(set, (value) => {
				if (PathMatcher.matchElement(value, cursor)) {
					result = true;
					return false;
				}
			});
			
			return result;
		},
		
		/**
		 * @param {{}} map
		 * @param {SeaRoute.route.utils.MatchCursor} cursor
		 * @return {boolean}
		 */
		matchMap: function (map, cursor) {
			if (cursor.EOP) {
				return false;
			} else if (!is.defined(map[cursor.current])) {
				return false;
			}
			
			var element = map[cursor.current];
			
			cursor.forward();
			
			if (PathMatcher.matchElement(element, cursor)) {
				return true;
			}
			
			cursor.back();
			
			return false;
		}
	};
	
	
	this.PathMatcher = PathMatcher;
});