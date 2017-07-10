namespace('SeaRoute.Route', function(root)
{
	var is		= root.Plankton.is;
	var foreach	= root.Plankton.foreach;
	
	
	/**
	 * @class SeaRoute.Route.Path
	 * 
	 * @param {string} path
	 * 
	 * @property {string} _path
	 * @property {SeaRoute.Route.Part[]} _parts
	 */
	var Path = function (path)
	{
		this._path = path;
		this._parts = [];
	};
	
	
	/**
	 * @param {SeaRoute.Route.Part} part
	 * @param {string} pathPart
	 * @return {boolean}
	 * @private
	 */
	Path.prototype._matchPart = function (part, pathPart)
	{
		if (!is(pathPart))
		{
			return part.isOptional();
		}
		
		return part.validate(pathPart);
	};
	
	
	/**
	 * @return {string}
	 */
	Path.prototype.text = function ()
	{
		return this._path;
	};
	
	/**
	 * @return {SeaRoute.Route.Part[]}
	 */
	Path.prototype.parts = function ()
	{
		return this._parts;
	};
	
	/**
	 * @param {SeaRoute.Route.Part|SeaRoute.Route.Part[]} part
	 * @return {SeaRoute.Route.Path}
	 */
	Path.prototype.addPart = function (part)
	{
		this._parts.push(part);
		return this;
	};
	
	/**
	 * @return {Number}
	 */
	Path.prototype.partsCount = function ()
	{
		return this._parts.length;
	};
	
	
	/**
	 * @param {string[]} rawPath
	 * @return {boolean}
	 */
	Path.prototype.isMatching = function (rawPath)
	{
		var length = this.partsCount();
		
		if (rawPath.length > length) {
			return false;
		}
		
		for (var index = 0; index < length; index++) {
			if (!this._matchPart(this._parts[index], rawPath[index])) {
				return false;
			}
		}
		
		return true;
	};
	
	/**
	 * @param {*} params
	 * @return {string}
	 */
	Path.prototype.encode = function (params)
	{
		var rawPath = [];
		var optional = [];
		var length = this.partsCount();
		var canHaveMoreParams = true;
		
		for (var index = 0; index < length; index++) {
			var value		= undefined;
			var part		= this._parts[index];
			var paramObj	= part.getParam();
			
			if (part.isConst()) {
				value = part.text();
			
			// If part is a parameter and there is passed parameter for the url, encode it.
			} else if (is.defined(params[part.getParamName()])) {
				value = part.encode(params[part.getParamName()]);
				
			// IF the parameter is AutoFill, always add it's value.
			} else if (paramObj.isAutoFillURL()) {
				value = part.encode(paramObj.defaultValue());
				
			// If the parameter has a default value (means it also optional) add it's value only if more 
			// parameters later in the chain are passed.
			} else if (paramObj.hasDefaultValue()) {
				optional.push(encodeURIComponent(part.encode(paramObj.defaultValue())));
			
			// If the parameter is optional but was not provided and default value is not set: 
			// No more parameters can be added to the path.
			} else if (paramObj.isOptional()) {
				canHaveMoreParams = false;
				
			// Else, the parameter is required.
			} else {
				throw new Error('Parameter ' + paramObj.name() + ' is required for the path ' + this._path);
			}
			
			if (is(value)) {
				if (!canHaveMoreParams) {
					throw new Error('Optional parameter must be set if ' + paramObj.name() + ' is provided. ' + 
						'Set ' + paramObj.name() + ' or provide a default value for it');
				}
				
				if (is(optional)) {
					rawPath = rawPath.concat(optional);
					optional = [];
				}
				
				rawPath.push(encodeURIComponent(value));
			}
		}
		
		return '/' + rawPath.join('/');
	};
	
	/**
	 * @param {string[]} rawPath
	 * @return {*}
	 */
	Path.prototype.extract = function (rawPath)
	{
		var params = {};
		var length = this.partsCount();
		
		for (var index = 0; index < length; index++)
		{
			this._parts[index].extract(rawPath[index], params);
		}
		
		return params;
	};
	
	/**
	 * @return {[string]}
	 */
	Path.prototype.paramNames = function ()
	{
		var res = [];
		
		foreach(this._parts, function (part) 
		{
			if (!part.isConst())
			{
				res.push(part.getParamName());
			}
		});
		
		return res;
	};
	
	
	this.Path = Path;
});