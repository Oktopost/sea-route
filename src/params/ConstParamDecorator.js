require('../../namespace').namespace('SeaRoute.params', function(root) {
	'use strict';
	
	
	var Param = root.SeaRoute.params.Param;
	
	var is	= root.Plankton.is;
	var obj	= root.Plankton.obj;
	
	
	/**
	 * @class SeaRoute.params.ConstParamDecorator
	 * 
	 * @param {string} name
	 * @param {SeaRoute.params.Param} param
	 * 
	 * @property {string} _name
	 * @property {SeaRoute.params.Param} _original
	 */
	var ConstParamDecorator = function(name, param) {
		var self = this;
		Param.call(this, name);
		
		
		this.validate	= param.validate;
		this.extract	= param.extract;
		this.encode		= param.encode;
	};
	
	
	ConstParamDecorator.prototype = Object.create(Param.prototype);
	ConstParamDecorator.prototype.constructor = ConstParamDecorator;
	
	
	this.ConstParamDecorator = ConstParamDecorator;
});