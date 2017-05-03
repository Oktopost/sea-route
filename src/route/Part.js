require('../../namespace').namespace('SeaRoute.route', function(root) {
	'use strict';
	
	
	var is = root.Plankton.is;
	
	
	/**
	 * @class SeaRoute.route.Part
	 * 
	 * @param {string}	text
	 * 
	 * @property {string} _text
	 * @property {SeaRoute.params.Param} _param
	 */
	var Part = function(text) {
		this._text		= text;
		this._param		= null;
	};
	
	
	/**
	 * @return {string}
	 */
	Part.prototype.text = function () {
		return this._text;
	};

	/**
	 * @return {boolean}
	 */
	Part.prototype.isConst = function () {
		return !is(this._param);
	};

	/**
	 * @param {SeaRoute.params.Param} param
	 */
	Part.prototype.setParam = function (param) {
		this._param = param;
		return this;
	};

	/**
	 * @return {SeaRoute.params.Param}
	 */
	Part.prototype.getParam = function () {
		return this._param;
	};

	/**
	 * @return {string}
	 */
	Part.prototype.getParamName = function () {
		return this._param.name();
	};

	/**
	 * @return {boolean}
	 */
	Part.prototype.isOptional = function () {
		if (this.isConst()) {
			return false;
		}
		
		return this._param.isOptional();
	};
	
	
	/**
	 * @param {string} data
	 * @return {boolean}
	 */
	Part.prototype.validate = function (data) {
		if (this.isConst()) {
			return (data === this._text);
		} else {
			return this._param.validate(data);
		}
	};
	
	/**
	 * @param {*} param
	 * @return {string}
	 */
	Part.prototype.encode = function (param) {
		if (this.isConst()) {
			return this._text;
		} else {
			return this._param.encode(param);
		}
	};
	
	/**
	 * @param {string} data
	 * @param {*} params
	 */
	Part.prototype.extract = function (data, params) {
		if (!this.isConst()) {
			params[this._param.name()] = this._param.extract(data);
		}
	};
	
	
	this.Part = Part;
});