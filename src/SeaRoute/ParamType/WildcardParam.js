namespace('SeaRoute.ParamType', function(root) {
	'use strict';
	
	
	var RegexParam	= root.SeaRoute.ParamType.RegexParam;
	
	
	/**
	 * @class SeaRoute.ParamType.WildcardParam
	 * @extends SeaRoute.ParamType.RegexParam
	 * 
	 * @param {string} name
	 * @param {string} expression
	 */
	var WildcardParam = function(name, expression) {
		RegexParam.call(this, name, new RegExp('^' + expression.replace('*', '.*') + '$'));
	};
	
	
	WildcardParam.prototype = Object.create(RegexParam.prototype);
	WildcardParam.prototype.constructor = WildcardParam;
	
	
	this.WildcardParam = WildcardParam;
});