require('../../../namespace').namespace('SeaRoute.route.utils', function(root) {
	'use strict';
	
	
	var is			= root.Plankton.is;
	var array		= root.Plankton.array;
	

	/**
	 * @class SeaRoute.route.utils.MatchCursor
	 * 
	 * @param {string} query
	 */
	var MatchCursor = function(query) {
		var self = this;
		
		this.rawParts	= [];
		this.rawQuery	= {};
		this.index		= 0;
		this.EOP		= false;
		this.current	= false;
		
		
		var url = query.split('?');
		var path = url[0];
		var queryParts = url.length > 1 ? url[1] : '';
		
		array.forEach(path.split('/'), function (part) {
			if (part.length > 0) {
				self.rawParts.push(part);
			}
		});
		
		array.forEach(queryParts.split('&'), function (queryParam) {
			var data = queryParam.split('=');
			
			if (data.length !== 2) {
				return;
			}
			
			self.rawQuery[data[0]] = decodeURI(data[1]);
		});
		
		this.EOP		= this.rawParts.length === 0;
		this.current	= is(this.rawParts) ? this.rawParts[0] : false;
	};
	
	
	MatchCursor.prototype.forward = function () {
		this.index++;
		
		this.EOP		= (this.index === this.rawParts.length);
		this.current	= (this.EOP ? false : this.rawParts[this.index]);
	};
	
	MatchCursor.prototype.back = function () {
		this.index--;
		
		this.EOP		= false;
		this.current	= this.rawParts[this.index];
	};
	
	
	this.MatchCursor = MatchCursor;
});