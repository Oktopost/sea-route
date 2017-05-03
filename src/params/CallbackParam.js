require('../../namespace').namespace('SeaRoute.params', function(root) {
	'use strict';
	
	
	var Param	= root.SeaRoute.params.Param;
	
	
	/**
	 * @class SeaRoute.params.CallbackParam
	 * @extends SeaRoute.params.Param
	 * 
	 * @param {string}	name
	 * @param {*}		callbacks
	 * 
	 * @property {function(string): boolean}	_validator
	 * @property {function(string): *}			_extractor
	 * @property {function(*): string}			_encoder
	 */
	var CallbackParam = function(name, callbacks) {
		Param.call(this, name);
		
		this._validator = callbacks.validate;
		this._extractor = callbacks.extract;
		this._encoder	= callbacks.encode;
	};
	
	
	CallbackParam.prototype = Object.create(Param.prototype);
	CallbackParam.prototype.constructor = CallbackParam;
	
	
	/**
	 * @param {string} data
	 * @return {boolean}
	 */
	CallbackParam.prototype.validate = function (data) {
		return this._validator(data);
	};
	
	/**
	 * @param {*} data
	 * @return {string}
	 */
	CallbackParam.prototype.encode = function (data) {
		return this._encoder(data);
	};
	
	/**
	 * @param {string} data
	 * @return {Number}
	 */
	CallbackParam.prototype.extract = function (data) {
		return this._extractor(data);
	};
	
	
	this.CallbackParam = CallbackParam;
});