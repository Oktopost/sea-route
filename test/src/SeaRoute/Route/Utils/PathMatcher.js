'use strict';


const SeaRoute		= require('../../../../index');

const Route			= SeaRoute.Route.Route;
const PathMatcher	= SeaRoute.Route.Utils.PathMatcher;
const MatchCursor	= SeaRoute.Route.Utils.MatchCursor;

const assert = require('chai').assert;


suite('PathMatcher', () =>
{
	suite('matchElement', () => 
	{
		test('Invalid element passed - exception thrown', () => 
		{
			var m = new MatchCursor('');
			
			assert.throws(() => 
			{
				PathMatcher.matchElement('abc', m);
			});
		});
	});
	
	
	suite('matchMap', () => 
	{
		test('Cursor reached end of path - return false', () => 
		{
			var m = new MatchCursor('');
			var r = new Route('a', () => {});
			
			r.isMatching = () => { return true; };
			r.handle = () => { return; };
			
			m.current = 'a';
			m.EOP = true;
			
			
			assert.isFalse(PathMatcher.matchMap({'a': r}, m));
		});
	});
});