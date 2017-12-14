namespace('SeaRoute.Route.Utils', function (root) 
{
	var url		= root.Plankton.url;
	

	/**
	 * @class SeaRoute.Route.Utils.MatchCursor
	 * 
	 * @param {string} query
	 */
	var MatchCursor = function(query)
	{
		var urlData = url.decode(query);
		
		this.rawParts	= urlData.path;
		this.rawQuery	= urlData.params;
		this.index		= 0;
		this.EOP		= (this.rawParts.length === 0);
		this.current	= (!this.EOP ? this.rawParts[0] : false);
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