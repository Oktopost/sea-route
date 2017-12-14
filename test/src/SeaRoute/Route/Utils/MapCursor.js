'use strict';


const SeaRoute		= require('../../../../index');

const Path		= SeaRoute.Route.Path;
const Route		= SeaRoute.Route.Route;
const MapCursor	= SeaRoute.Route.Utils.MapCursor;

const assert = require('chai').assert;


suite('MapCursor', () =>
{
	suite('goto', () => 
	{
		test('goto invalid index - return false', () => 
		{
			var r = new Route(new Path(''), () => {});
			var map = new MapCursor(r);
			
			assert.isFalse(map.goto(2));
		});
	});
});