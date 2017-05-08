require('../namespace').namespace('SeaRoute', function(root) {
	'use strict';
	
	
	var ParamParser = root.SeaRoute.parsers.ParamParser;
	
	var is			= root.Plankton.is;
	var obj			= root.Plankton.obj;
	var array		= root.Plankton.array;
	
	
	/**
	 * @name SeaRoute.route.Routes
	 */
	var Params = {

		/**
		 * @param {{}} data
		 * @return {{SeaRoute.param.Param}}
		 */
		create: function (data) {
			var result = {};
			var name;
				
			obj.forEach.pair(data, function (key, value) {
				name = (is.string(value.name) ? value.name : key);
				result[key] = ParamParser.parse(name, value);
			});
			
			return result;
		}
	};
	
	
	this.Params = Params;
});