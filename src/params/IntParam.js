require('../../namespace').namespace('SeaRoute.params', function(root) {
	'use strict';
	
	
	var is		= root.Plankton.is;
	var Param	= root.SeaRoute.params.Param;
	
	
	/**
	 * @class SeaRoute.params.IntParam
	 * @extends SeaRoute.params.Param
	 * 
	 * @param {string} name
	 * @param {number|undefined} min
	 * @param {number|undefined} max
	 * 
	 * @property {number} _min
	 * @property {number} _max
	 */
	var IntParam = function(name, min, max) {
		Param.call(this, name);
		
		this._min = is.number(min) ? min : Number.MIN_VALUE;
		this._max = is.number(max) ? max : Number.MAX_VALUE;
	};
	
	
	IntParam.prototype = Object.create(Param.prototype);
	IntParam.prototype.constructor = IntParam;
	
	
	/**
	 * @param {string} data
	 * @return {boolean}
	 */
	IntParam.prototype.validate = function (data) {
		var value = Number.parseInt(data);
		
		if (is.NaN(value)) {
			return false;
		}
		
		return (value >= this._min && value <= this._max);
	};
	
	/**
	 * @param {*} data
	 * @return {string}
	 */
	IntParam.prototype.encode = function (data) {
		if (!is.number(data)) {
			data = Number.parseInt(data.toString());
			
			if (is.NaN(data)) {
				throw "Invalid parameter provided for " + this.name();
			}
		}
		
		return Math.round(data).toString();
	};
	
	/**
	 * @param {string} data
	 * @return {Number}
	 */
	IntParam.prototype.extract = function (data) {
		return Number.parseInt(data);
	};
	
	
	this.IntParam = IntParam;
});