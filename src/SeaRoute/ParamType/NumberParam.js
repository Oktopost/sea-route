namespace('SeaRoute.ParamType', function(root)
{
	var is		= root.Plankton.is;
	var Param	= root.SeaRoute.ParamType.Param;
	
	
	/**
	 * @class SeaRoute.ParamType.NumberParam
	 * @extends SeaRoute.ParamType.Param
	 * 
	 * @param {string} name
	 * @param {number|undefined} min
	 * @param {number|undefined} max
	 * 
	 * @property {number} _min
	 * @property {number} _max
	 */
	var NumberParam = function(name, min, max)
	{
		Param.call(this, name);
		
		this._min = is.number(min) ? min : Number.MIN_VALUE;
		this._max = is.number(max) ? max : Number.MAX_VALUE;
	};
	
	
	NumberParam.prototype = Object.create(Param.prototype);
	NumberParam.prototype.constructor = NumberParam;

	/**
	 * @param {Number} min
	 * @return {SeaRoute.ParamType.NumberParam}
	 */
	NumberParam.prototype.setMin = function (min)
	{
		this._min = min;
		return this;
	};

	/**
	 * @param {Number} max
	 * @return {SeaRoute.ParamType.NumberParam}
	 */
	NumberParam.prototype.setMax = function (max)
	{
		this._max = max;
		return this;
	};
	
	
	/**
	 * @param {string} data
	 * @return {boolean}
	 */
	NumberParam.prototype.validate = function (data)
	{
		var value = parseFloat(data);
		return (!is.NaN(value) && value >= this._min && value <= this._max);
	};
	
	/**
	 * @param {*} data
	 * @return {string}
	 */
	NumberParam.prototype.encode = function (data)
	{
		if (!is.number(data))
		{
			data = parseFloat(data.toString());
			
			if (is.NaN(data))
				throw new Error('Invalid parameter provided for ' + this.name());
		}
		
		return data.toString();
	};
	
	/**
	 * @param {string} data
	 * @return {Number}
	 */
	NumberParam.prototype.extract = function (data)
	{
		return parseFloat(data);
	};
	
	
	this.NumberParam = NumberParam;
});