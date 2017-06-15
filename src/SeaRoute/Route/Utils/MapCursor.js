namespace('SeaRoute.Route.Utils', function(root)
{
	var is		= root.Plankton.is;
	var foreach	= root.Plankton.foreach;
	
	
	/**
	 * @class SeaRoute.Route.Utils.MapCursor
	 * 
	 * @property {function([], *): []|undefined} addRoute
	 * @property {function([]): *|undefined} getCompareElement
	 * @property {function([]): Number|undefined} getCompareElementIndex
	 * 
	 * @param {SeaRoute.Route.Route} route
	 */
	var MapCursor = function (route)
	{
		var self = this;
		
		this.route		= route;
		this.rawParts	= [];
		this.index		= 0;
		this.EOP		= false;
		this.current	= false;
		
		
		foreach(
			route.path().parts(),
			
			/**
			 * @param {SeaRoute.Route.Part} part
			 */
			function (part)
			{
				if (!part.isConst())
				{
					return false;
				}
				
				self.rawParts.push(part.text());
			}
		);
		
		
		this.EOP		= this.rawParts.length === 0;
		this.current	= is(this.rawParts) ? this.rawParts[0] : false;
	};
	
	
	MapCursor.prototype.forward = function ()
	{
		this.goto(this.index + 1);
	};
	
	MapCursor.prototype.back = function ()
	{
		this.goto(this.index - 1);
	};
	
	MapCursor.prototype.goto = function (index)
	{
		if (this.rawParts.length < index)
		{
			return false;
		}
		
		this.index		= index;
		this.EOP		= (this.index === this.rawParts.length);
		this.current	= (this.EOP ? false : this.rawParts[this.index]);
		
		return true;
	};


	/**
	 * @param {SeaRoute.Route.Route} route
	 * @return {SeaRoute.Route.Utils.MapCursor}
	 */
	MapCursor.createAppendCursor = function (route)
	{
		var cursor = new MapCursor(route);
		
		cursor.getCompareElement = function (arr) { return arr[arr.length - 1]; };
		cursor.getCompareElementIndex = function (arr) { return arr.length - 1; };
		cursor.addRoute = function (arr, element) { arr.push(element); return arr; };
		
		return cursor;
	};

	/**
	 * @param {SeaRoute.Route.Route} route
	 * @return {SeaRoute.Route.Utils.MapCursor}
	 */
	MapCursor.createPrependCursor = function (route)
	{
		var cursor = new MapCursor(route);
		
		cursor.getCompareElement = function (arr) { return arr[0]; };
		cursor.getCompareElementIndex = function (arr) { return arr.length - 1; };
		cursor.addRoute = function (arr, element) { arr.unshift(element); return arr; };
		
		return cursor;
	};
	
	
	this.MapCursor = MapCursor;
});