require('../../../namespace').namespace('SeaRoute.route.utils', function(root) {
	'use strict';
	
	
	var is		= root.Plankton.is;
	var array	= root.Plankton.array;
	

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
		
		var data = query.split('?');
		
		if (data.length === 1) {
			data.push({});
		} else if (data.length > 2) {
			data = [data[0], data.splice(1).join('?')];
		}
		
		array.forEach(data[0].split('/'), function (pathPart) {
			if (pathPart.length !== 0) {
				self.rawParts.push(decodeURI(pathPart));
			}
		});
		
		array.forEach(data[1].split('&'), function (queryExpression) {
			var query = queryExpression.split('=');
			
			if (query.length === 1) {
				query.push('');
			} else if (query.length > 2) {
				query = [query[0], query.splice(1).join('?')];
			}
			
			self.rawQuery[decodeURI(query[0])] = decodeURI(query[1]);
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