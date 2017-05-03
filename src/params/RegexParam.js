require('../../namespace').namespace('SeaRoute.params', function(root) {
	'use strict';
	
	
	var Param	= root.SeaRoute.params.Param;
	
	
	/**
	 * @class SeaRoute.params.RegexParam
	 * @extends SeaRoute.params.Param
	 * 
	 * @param {string}	name
	 * @param {RegExp}	regex
	 * 
	 * @property {RegExp} _regex
	 */
	var RegexParam = function(name, regex) {
		Param.call(this, name);
		
		this._regex = regex;
	};
	
	
	RegexParam.prototype = Object.create(Param.prototype);
	RegexParam.prototype.constructor = RegexParam;
	
	
	/**
	 * @param {string} data
	 * @return {boolean}
	 */
	RegexParam.prototype.validate = function (data) {
		return this._regex.test(data);
	};
	
	/**
	 * @param {string} data
	 * @return {string}
	 */
	RegexParam.prototype.encode = function (data) {
		data = data.toString();
		
		if (!this._regex.test(data)) {
			throw "Pass variable doesn't match regex: " + this._regex.toString();
		}
		
		return data;
	};
	
	/**
	 * @param {string} data
	 * @return {string}
	 */
	RegexParam.prototype.extract = function (data) {
		return data;
	};
	
	
	this.RegexParam = RegexParam;
});