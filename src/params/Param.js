require('../../namespace').namespace('SeaRoute.params', function(root) {
	'use strict';
	
	
	var is = root.Plankton.is;
	
	
	/**
	 * @class SeaRoute.params.Param
	 * 
	 * @param {string} name
	 * 
	 * @property {string}	_name
	 * @property {boolean}	_isOptional
	 * @property {boolean}	_isAutoFillURL
	 * @property {*}		_defaultValue
	 */
	var Param = function(name) {
		this._name			= name;
		this._isOptional	= false;
		this._isAutoFillURL	= false;
		this._defaultValue	= undefined;
	};
	

	/**
	 * @return {string}
	 */
	Param.prototype.name = function () {
		return this._name;
	};

	/**
	 * @return {*}
	 */
	Param.prototype.defaultValue = function () {
		return this._isOptional ? this._defaultValue : undefined;
	};

	/**
	 * @return {boolean}
	 */
	Param.prototype.hasDefaultValue = function() {
		return this._isOptional && is(this._defaultValue);
	};
	
	/**
	 * @return {boolean}
	 */
	Param.prototype.isOptional = function () {
		return this._isOptional;
	};

	/**
	 * @return {boolean}
	 */
	Param.prototype.isAutoFillURL = function () {
		return this.hasDefaultValue() && this._isAutoFillURL;
	};
	
	
	/**
	 * @param {*} value
	 * @return {SeaRoute.params.Param}
	 */
	Param.prototype.setDefaultValue = function (value) {
		this._isOptional = true;
		this._defaultValue = value;
		return this;
	};
	
	/**
	 * @param {boolean} isOptional
	 * @return {SeaRoute.params.Param}
	 */
	Param.prototype.setIsOptional = function (isOptional) {
		this._isOptional = isOptional;
		return this;
	};
	
	/**
	 * @param {boolean} isAutoFillURL
	 * @return {SeaRoute.params.Param}
	 */
	Param.prototype.setIsAutoFillURL = function (isAutoFillURL) {
		this._isAutoFillURL = isAutoFillURL;
		return this;
	};
	
	
	/**
	 * @param {string} data
	 * @return {boolean}
	 */
	Param.prototype.validate = function (data) {
		return true;
	};
	
	/**
	 * @param {*} data
	 * @return {string}
	 */
	Param.prototype.encode = function (data) {
		return data.toString();
	};
	
	/**
	 * @param {string} data
	 * @return {*}
	 */
	Param.prototype.extract = function (data) {
		return data;
	};
	
	
	this.Param = Param;
});