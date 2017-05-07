require('../../namespace').namespace('SeaRoute.params', function(root) {
	'use strict';
	
	
	var RegexParam	= root.SeaRoute.params.RegexParam;
	
	
	/**
	 * @class SeaRoute.params.WildcardParam
	 * @extends SeaRoute.params.RegexParam
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