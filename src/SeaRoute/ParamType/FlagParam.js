namespace('SeaRoute.ParamType', function(root)
{
	var Param	= root.SeaRoute.ParamType.Param;
	
	
	/**
	 * @class SeaRoute.ParamType.FlagParam
	 * @extends SeaRoute.ParamType.Param
	 * 
	 * @param {string} name
	 * 
	 * @property {number} _min
	 * @property {number} _max
	 */
	var FlagParam = function(name)
	{
		Param.call(this, name);
	};
	
	
	FlagParam.prototype = Object.create(Param.prototype);
	FlagParam.prototype.constructor = FlagParam;

	
	/**
	 * @param {string} data
	 * @return {boolean}
	 */
	FlagParam.prototype.validate = function (data)
	{
		return data === this.name();
	};
	
	/**
	 * @return {boolean}
	 */
	FlagParam.prototype.isOptional = function ()
	{
		return true;
	};
	
	/**
	 * @return {boolean}
	 */
	FlagParam.prototype.defaultValue = function ()
	{
		return false;
	};
	
	/**
	 * @return {boolean}
	 */
	FlagParam.prototype.hasDefaultValue = function ()
	{
		return true;
	};
	
	/**
	 * @return {string}
	 */
	FlagParam.prototype.encode = function ()
	{
		return this.name();
	};
	
	/**
	 * @return {boolean}
	 */
	FlagParam.prototype.extract = function ()
	{
		return true;
	};
	
	
	this.FlagParam = FlagParam;
});