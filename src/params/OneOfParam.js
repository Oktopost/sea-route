require('../../namespace').namespace('SeaRoute.params', function(root) {
	'use strict';
	
	
	var Param	= root.SeaRoute.params.Param;
	var is		= root.Plankton.is;
	
	
	/**
	 * @class SeaRoute.params.OneOfParam
	 * @extends SeaRoute.params.Param
	 * 
	 * @param {string}		name
	 * @param {string[]}	of
	 * 
	 * @property {string[]} _of
	 */
	var OneOfParam = function(name, of) {
		Param.call(this, name);
		
		this._of = of;
	};
	
	
	OneOfParam.prototype = Object.create(Param.prototype);
	OneOfParam.prototype.constructor = OneOfParam;
	
	
	/**
	 * @param {string} data
	 * @return {boolean}
	 */
	OneOfParam.prototype.validate = function (data) {
		return this._of.indexOf(data) !== -1;
	};
	
	/**
	 * @param {string} data
	 * @return {string}
	 */
	OneOfParam.prototype.encode = function (data) {
		return data;
	};
	
	/**
	 * @param {string} data
	 * @return {string}
	 */
	OneOfParam.prototype.extract = function (data) {
		data = is.defined(data) ? data.toString() : '';
		
		if (!this.validate(data)) {
			throw '"' + data + '" is not of an expected value: ' + this._of.join(', ');
		}
		
		return data;
	};
	
	
	this.OneOfParam = OneOfParam;
});