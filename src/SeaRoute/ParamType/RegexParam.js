namespace('SeaRoute.ParamType', function(root)
{
	var Param	= root.SeaRoute.ParamType.Param;
	
	
	/**
	 * @class SeaRoute.ParamType.RegexParam
	 * @extends SeaRoute.ParamType.Param
	 * 
	 * @param {string}	name
	 * @param {RegExp}	regex
	 * 
	 * @property {RegExp} _regex
	 */
	var RegexParam = function(name, regex)
	{
		Param.call(this, name);
		
		this._regex = regex;
	};
	
	
	RegexParam.prototype = Object.create(Param.prototype);
	RegexParam.prototype.constructor = RegexParam;
	
	
	/**
	 * @param {string} data
	 * @return {boolean}
	 */
	RegexParam.prototype.validate = function (data)
	{
		return this._regex.test(data);
	};
	
	/**
	 * @param {string} data
	 * @return {string}
	 */
	RegexParam.prototype.encode = function (data)
	{
		data = data.toString();
		
		if (!this._regex.test(data)) {
			throw new Error('Pass variable doesn\'t match regex: ' + this._regex.toString());
		}
		
		return data;
	};
	
	/**
	 * @param {string} data
	 * @return {string}
	 */
	RegexParam.prototype.extract = function (data)
	{
		return data;
	};
	
	
	this.RegexParam = RegexParam;
});