namespace('SeaRoute', function(root)
{
	var RoutesBuilder	= root.SeaRoute.RoutesBuilder;
	var Route			= root.SeaRoute.Route.Route;
	var Mapper			= root.SeaRoute.Route.Utils.Mapper;
	var MapCursor		= root.SeaRoute.Route.Utils.MapCursor;
	var PathMatcher		= root.SeaRoute.Route.Utils.PathMatcher;
	var MatchCursor		= root.SeaRoute.Route.Utils.MatchCursor;
	
	var is		= root.Plankton.is;
	var url		= root.Plankton.url;
	var foreach	= root.Plankton.foreach;
	
	var classify	= root.Classy.classify;
	
	
	/**
	 * @class SeaRoute.Router
	 * 
	 * @param {function(string)}	navigateCallback
	 * @param {function(string)=}	missHandler
	 * 
	 * @property {SeaRoute.RoutesBuilder}	_builder
	 * @property {function(string)}			_navigate
	 * @property {function(string)}			_onMiss
	 * @property {[]}						_map
	 */
	var Router =  function (navigateCallback, missHandler)
	{
		this._map		= [];
		this._builder	= new RoutesBuilder();
		this._navigate	= navigateCallback;
		this._onMiss	= missHandler || Router._defaultOnMiss;
		
		classify(this);
	};
	

	/**
	 * @param {*|SeaRoute.Route.Route} routes
	 * @param {*} cursorCreator
	 * @private
	 */
	Router.prototype._addRoutes = function (routes, cursorCreator)
	{
		var self = this;
		
		if (routes instanceof Route)
		{
			if (this._map.length === 0)
			{
				this._map.push(routes);
			}
			else
			{
				Mapper.mergeWithArray(this._map, cursorCreator(routes));
			}
		}
		else
		{
			foreach(routes, function (item)
			{
				self._addRoutes(item, cursorCreator);
			});
		}
	};


	/**
	 * @param {{}} params
	 * @return {SeaRoute.Router}
	 */
	Router.prototype.addParams = function (params)
	{
		this._builder.addParams(params);
		return this;
	};
	
	Router.prototype.appendRoutes = function (routes)
	{
		routes = this._builder.create(routes);
		this._addRoutes(routes, MapCursor.createAppendCursor);
	};

	/**
	 * @param {SeaRoute.Route.Route|string} target
	 * @param {{}=} params
	 */
	Router.prototype.link = function (target, params)
	{
		params = params || {};
		
		if (is.string(target))
		{
			return url.encode(target, params);
		}
		else if (target instanceof Route)
		{
			return target.buildPath(params);
		}
		else
		{
			throw new Error('Target must be Route or string!');
		}
	};
	
	/**
	 * @param {SeaRoute.Route.Route|string} target
	 * @param {{}=} params
	 */
	Router.prototype.navigate = function (target, params)
	{
		this._navigate(this.link(target, params));
	};

	/**
	 * @param {string} url
	 */
	Router.prototype.handle = function (url)
	{
		if (!PathMatcher.matchArray(this._map, new MatchCursor(url)))
		{
			this._onMiss(url);
		}
	};
	
	
	/**
	 * @param {string} url
	 * @private
	 */
	Router._defaultOnMiss = function (url)
	{
		throw new Error('There is no route matching ' + url.toString() + ' url');
	};
	
	
	this.Router = Router;
}); 