require('../../namespace').namespace('SeaRoute.params', function(root) {
	'use strict';
	
	
	var Param = root.SeaRoute.params.Param;
	
	var is	= root.Plankton.is;
	var obj	= root.Plankton.obj;
	
	
	/**
	 * @class SeaRoute.params.ConstParamDecorator
	 * 
	 * @param {string} name
	 * @param {SeaRoute.params} param
	 * 
	 * @property {string} _name
	 * @property {SeaRoute.params.Param} _original
	 */
	var ConstParamDecorator = function(name, param) {
		var self = this;
		
		
		this._name = name;
		
		
		obj.forEach.pair(this, function (key, val) {
			if (key !== 'name' && is.function(val)) {
				self[key] = val.bind(param);
			}
		});
	};
	
	
	ConstParamDecorator.prototype = Object.create(Param.prototype);
	ConstParamDecorator.prototype.constructor = ConstParamDecorator;
	

	/**
	 * @return {string}
	 */
	ConstParamDecorator.prototype.name = function () {
		return this._name;
	};
	
	
	this.ConstParamDecorator = ConstParamDecorator;
});