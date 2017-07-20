namespace('SeaRoute.ParamType', function(root)
{
	var is		= root.Plankton.is;
	var Param	= root.SeaRoute.ParamType.Param;
	
	
	/**
	 * @class SeaRoute.ParamType.JsonParam
	 * @extends SeaRoute.ParamType.Param
	 * 
	 * @param {string}	name
	 * 
	 * @property {RegExp} _regex
	 */
	var JsonParam = function(name)
	{
		Param.call(this, name);
	};
	
	
	JsonParam.prototype = Object.create(Param.prototype);
	JsonParam.prototype.constructor = JsonParam;
	
	
	/**
	 * @param {string} data
	 * @return {boolean}
	 */
	JsonParam.prototype.validate = function (data)
	{
		return is.json(data);
	};
	
	/**
	 * @param {string} data
	 * @return {string}
	 */
	JsonParam.prototype.encode = function (data)
	{
		return JSON.stringify(data);
	};
	
	/**
	 * @param {string} data
	 * @return {string}
	 */
	JsonParam.prototype.extract = function (data)
	{
		return JSON.parse(data);
	};
	
	
	this.JsonParam = JsonParam;
});