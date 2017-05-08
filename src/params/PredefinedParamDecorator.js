require('../../namespace').namespace('SeaRoute.params', function(root) {
	'use strict';
	
	
	var Param = root.SeaRoute.params.Param;
	
	var is	= root.Plankton.is;
	var obj	= root.Plankton.obj;
	
	
	/**
	 * @class SeaRoute.params.PredefinedParamDecorator
	 * 
	 * @param {string} name
	 * @param {SeaRoute.params.Param} param
	 * 
	 * @property {string} _name
	 * @property {SeaRoute.params.Param} _original
	 */
	var PredefinedParamDecorator = function(name, param) {
		Param.call(this, name);
		
		
		this.setIsAutoFillURL(param.isAutoFillURL());
		this.setIsOptional(param.isOptional());
		this.setDefaultValue(param.defaultValue());
		
		
		this.validate	= param.validate;
		this.extract	= param.extract;
		this.encode		= param.encode;
	};
	
	
	PredefinedParamDecorator.prototype = Object.create(Param.prototype);
	PredefinedParamDecorator.prototype.constructor = PredefinedParamDecorator;
	
	
	this.PredefinedParamDecorator = PredefinedParamDecorator;
});