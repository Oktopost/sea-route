namespace('SeaRoute', function (root)
{
	var ParamParser = root.SeaRoute.Parsers.ParamParser;
	
	var is		= root.Plankton.is;
	var foreach	= root.Plankton.foreach;
	
	
	/**
	 * @name SeaRoute.Route.Routes
	 */
	var Params = {

		/**
		 * @param {{}} data
		 * @return {{SeaRoute.param.Param}}
		 */
		create: function (data)
		{
			var result = {};
			var name;
				
			foreach.pair(data, function (key, value)
			{
				name = (is.string(value.name) ? value.name : key);
				result[key] = ParamParser.parse(name, value);
			});
			
			return result;
		}
	};
	
	
	this.Params = Params;
});