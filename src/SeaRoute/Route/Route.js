namespace('SeaRoute.Route', function(root)
{
	var Query	= root.SeaRoute.Route.Query;
	
	var is		= root.Plankton.is;
	var foreach	= root.Plankton.foreach;
	
	
	/**
	 * @class SeaRoute.Route.Route
	 * 
	 * @param {SeaRoute.Route.Path} path
	 * @param {function(*)} handler
	 * 
	 * @property {SeaRoute.Route.Path}	_path
	 * @property {SeaRoute.Route.Query}	_query
	 * @property {function(*)}			_handler
	 */
	var Route = function (path, handler)
	{
		this._query		= new Query();
		this._path		= path;
		this._handler	= handler;
	};
	
	
	/**
	 * @return {SeaRoute.Route.Path}
	 */
	Route.prototype.path = function ()
	{
		return this._path;
	};
	
	/**
	 * @return {string}
	 */
	Route.prototype.pathText = function ()
	{
		return this._path.text();
	};
	
	/**
	 * @param {SeaRoute.ParamType.Param[]|SeaRoute.ParamType.Param} params
	 * @return {SeaRoute.Route.Route}
	 */
	Route.prototype.addQueryParam = function (params)
	{
		this._query.add(params);
		return this;
	};
	
	/**
	 * @return {boolean}
	 */
	Route.prototype.hasQueryParams = function ()
	{ 
		return !this._query.isEmpty();
	};
	
	
	/**
	 * @param {string[]} rawPath
	 * @return {boolean}
	 */
	Route.prototype.isMatching = function (rawPath)
	{
		return this._path.isMatching(rawPath);
	};
	
	/**
	 * @param {string[]} rawPath
	 * @param {*} rawQuery
	 */
	Route.prototype.handle = function (rawPath, rawQuery)
	{
		var params = this._path.extract(rawPath);
		var queryParams = this._query.parseQuery(rawQuery);
		
		foreach.pair(queryParams, function(name, value)
		{
			if (!params.hasOwnProperty(name))
			{
				params[name] = value;
			}
		});
		
		this._handler(params);
	};
	
	/**
	 * @param {*} params
	 * @return {string}
	 */
	Route.prototype.buildPath = function (params) {
		var path		= this._path.encode(params);
		var query		= this._query.parseParameters(params);
		var queryParts	= [];
		
		if (is(query))
		{
			foreach.pair(query, function (name, value)
			{ 
				queryParts.push(name + '=' + encodeURIComponent(value))
			});
			
			path += '?' + queryParts.join('&');
		}
		
		return path;
	};
	
	/**
	 * @return {[string]}
	 */
	Route.prototype.paramNames = function ()
	{
		return this._path.paramNames().concat(this._query.paramNames());
	};
	
	
	this.Route = Route;
});