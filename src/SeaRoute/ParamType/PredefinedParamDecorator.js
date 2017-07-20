namespace('SeaRoute.ParamType', function(root)
{
	var Param = root.SeaRoute.ParamType.Param;
	
	var is	= root.Plankton.is;
	var obj	= root.Plankton.obj;
	
	
	/**
	 * @class SeaRoute.ParamType.PredefinedParamDecorator
	 * 
	 * @param {string} name
	 * @param {SeaRoute.ParamType.Param} param
	 * 
	 * @property {string} _name
	 * @property {SeaRoute.ParamType.Param} _original
	 */
	var PredefinedParamDecorator = function(name, param)
	{
		Param.call(this, name);
		
		
		this.setDefaultValue(param.defaultValue());
		this.setIsAutoFillURL(param.isAutoFillURL());
		this.setIsOptional(param.isOptional());
		
		
		this.validate	= param.validate;
		this.extract	= param.extract;
		this.encode		= param.encode;
	};
	
	
	PredefinedParamDecorator.prototype = Object.create(Param.prototype);
	PredefinedParamDecorator.prototype.constructor = PredefinedParamDecorator;
	
	
	this.PredefinedParamDecorator = PredefinedParamDecorator;
});