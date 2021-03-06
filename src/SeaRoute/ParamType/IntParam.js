namespace('SeaRoute.ParamType', function(root)
{
	var is		= root.Plankton.is;
	var Param	= root.SeaRoute.ParamType.Param;
	
	
	/**
	 * @class SeaRoute.ParamType.IntParam
	 * @extends SeaRoute.ParamType.Param
	 * 
	 * @param {string} name
	 * @param {number|undefined} min
	 * @param {number|undefined} max
	 * 
	 * @property {number} _min
	 * @property {number} _max
	 */
	var IntParam = function(name, min, max)
	{
		Param.call(this, name);
		
		this._min = is.number(min) ? min : Number.MIN_VALUE;
		this._max = is.number(max) ? max : Number.MAX_VALUE;
	};
	
	
	IntParam.prototype = Object.create(Param.prototype);
	IntParam.prototype.constructor = IntParam;

	/**
	 * @param {Number} min
	 * @return {SeaRoute.ParamType.IntParam}
	 */
	IntParam.prototype.setMin = function (min)
	{
		this._min = min;
		return this;
	};

	/**
	 * @param {Number} max
	 * @return {SeaRoute.ParamType.IntParam}
	 */
	IntParam.prototype.setMax = function (max)
	{
		this._max = max;
		return this;
	};
	
	
	/**
	 * @param {string} data
	 * @return {boolean}
	 */
	IntParam.prototype.validate = function (data)
	{
		var value = parseFloat(data);
		
		if (is.NaN(value))
		{
			return false;
		}
		
		return (value >= this._min && value <= this._max);
	};
	
	/**
	 * @param {*} data
	 * @return {string}
	 */
	IntParam.prototype.encode = function (data)
	{
		if (!is.number(data))
		{
			data = parseFloat(data.toString());
			
			if (is.NaN(data)) {
				throw new Error("Invalid parameter provided for " + this.name());
			}
		}
		
		return Math.round(data).toString();
	};
	
	/**
	 * @param {string} data
	 * @return {Number}
	 */
	IntParam.prototype.extract = function (data)
	{
		return Math.round(parseFloat(data));
	};
	
	
	this.IntParam = IntParam;
});