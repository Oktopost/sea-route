'use strict';


const SeaRoute = require('../../../../index');
const is = require('oktopost-plankton').is;
const obj = require('oktopost-plankton').obj;
const array = require('oktopost-plankton').array;


const Part		= SeaRoute.route.Part;
const Path		= SeaRoute.route.Path;
const Route		= SeaRoute.route.Route;
const Mapper	= SeaRoute.route.utils.Mapper;
const MapCursor	= SeaRoute.route.utils.MapCursor;
const Param		= SeaRoute.params.Param; 

const assert = require('chai').assert;


suite('Mapper', () => {

	/**
	 * @param {string} path
	 * @param {string[]=} parts
	 */
	function createRoute(path, parts) {
		var route = new Route(new Path(path), () => {});
		var partObjects = [];
		
		if (!is(parts)) {
			parts = [];
		}
		
		array.forEach(parts, (str) => {
			var part;
			
			if (str === null) {
				part = new Part('ERROR');
				part.isConst = function() { return false; }
			} else {
				part = new Part(str);
				part.isConst = function() { return true; }
			}
			
			partObjects.push(part);
		});
		
		route.path().parts = function () { return partObjects; }
		
		return route;
	}
	
	function clone(data) {
		if (data instanceof Route) {
			return data;
		} else if (is.array(data)) {
			var arr = [];
			
			array.forEach(data, (val) => {
				arr.push(clone(val));	
			});
			
			return arr;
		} else if (is.object(data)) {
			var map = {};
			
			obj.forEach.pair(data, (k, val) => {
				map[k] = clone(val);	
			});
			
			return map;
		}
		
		return data;
	}
	
	function _assertMap(expected, result) {
		if (expected === result) {
			return
		}
		
		if (expected instanceof Route || result instanceof Route) {
			throw 'No match';
		} else if (is.array(expected) && is.array(result)) {
			if (result.length !== expected.length) {
				throw 'No match';
			}
			
			array.forEach.key(expected, (index) => {
				_assertMap(expected[index], result[index]);
			});
		} else if (is.object(expected) && is.object(result) && obj.count(expected) === obj.count(result)) {
			obj.forEach.key(expected, (k) => {
				_assertMap(expected[k], result[k]);
			});
		} else {
			throw 'No match'
		}
	}
	
	function _getPrintObject(data) {
		if (data instanceof Route) {
			return data.pathText();
		} else if (is.array(data)) {
			var arr = [];
			
			array.forEach.key(data, (key) => {
				arr[key] = _getPrintObject(data[key]);	
			});
			
			return arr;
		} else if (is.object(data)) {
			var map = {};
			
			obj.forEach.pair(data, (k, val) => {
				map[k] = _getPrintObject(val);	
			});
			
			return map;
		}
		
		return 'Other: [' + (data || 'undefined') + ']';
	}
	
	function assertMap(expected, result) {
		try {
			_assertMap(expected, result);
		} catch (e) {
			console.log(e);
			
			console.log('Expected', JSON.stringify(_getPrintObject(expected), null, ''));
			console.log('Result', JSON.stringify(_getPrintObject(result), null, ''));
			
			assert.fail('Object not match');
		}
	}
	
	
	test('Two non const routes, appended', () => {
		var map	= [
			createRoute('a')
		];
		
		var original	= clone(map);
		var route		= createRoute('b');
		
		assertMap(
			[
				...original,
				route
			],
			Mapper.mergeWithArray(map, MapCursor.createAppendCursor(route))
		);
	});
	
	test('Two non const routes, prepended', () => {
		var map	= [
			createRoute('a')
		];
		
		var original	= clone(map);
		var route		= createRoute('b');
		
		assertMap(
			[
				route,
				...original
			],
			Mapper.mergeWithArray(map, MapCursor.createPrependCursor(route))
		);
	});
	
	test('Not matching mapped object, appended', () => {
		var map	= [
			{
				a: createRoute('a', ['a']) 
			}
		];
		
		var original	= clone(map);
		var route		= createRoute('b');
		
		assertMap(
			[
				...original,
				route
			],
			Mapper.mergeWithArray(map, MapCursor.createAppendCursor(route))
		);
	});
	
	test('Not matching mapped object, prepended', () => {
		var map	= [
			{
				a: createRoute('a', ['a']) 
			}
		];
		
		var original	= clone(map);
		var route		= createRoute('b');
		
		assertMap(
			[
				route,
				...original
			],
			Mapper.mergeWithArray(map, MapCursor.createPrependCursor(route))
		);
	});
	
	test('Matching mapped object, appended', () => {
		var map	= [
			{
				a: createRoute('a', ['a']) 
			}
		];
		
		var original	= clone(map);
		var route		= createRoute('b', ['a']);
		
		assertMap(
			[
				{
					a: [
						original[0].a,
						route
					]
				}
			],
			Mapper.mergeWithArray(map, MapCursor.createAppendCursor(route))
		);
	});
	
	test('Matching mapped object, prepended', () => {
		var map	= [
			{
				a: createRoute('a', ['a']) 
			}
		];
		
		var original	= clone(map);
		var route		= createRoute('b', ['a']);
		
		assertMap(
			[
				{
					a: [
						route,
						original[0].a
					]
				}
			],
			Mapper.mergeWithArray(map, MapCursor.createPrependCursor(route))
		);
	});
	
	test('Map missing key, appended', () => {
		var map	= [
			{
				a: createRoute('a', ['a']) 
			}
		];
		
		var original	= clone(map);
		var route		= createRoute('b', ['b']);
		
		assertMap(
			[
				{
					a: original[0].a,
					b: route
				}
			],
			Mapper.mergeWithArray(map, MapCursor.createAppendCursor(route))
		);
	});
	
	test('Map missing key, prepended', () => {
		var map	= [
			{
				a: createRoute('a', ['a']) 
			}
		];
		
		var original	= clone(map);
		var route		= createRoute('b', ['b']);
		
		assertMap(
			[
				{
					a: original[0].a,
					b: route
				}
			],
			Mapper.mergeWithArray(map, MapCursor.createPrependCursor(route))
		);
	});
	
	test('Map with array value, appended', () => {
		var map	= [
			{
				a: [
					createRoute('a1', ['a']),
					createRoute('a2', ['a'])
				]
			}
		];
		
		var original	= clone(map);
		var route		= createRoute('b', ['a']);
		
		assertMap(
			[
				{
					a: [
						...(original[0].a),
						route
					]
				}
			],
			Mapper.mergeWithArray(map, MapCursor.createAppendCursor(route))
		);
	});
	
	test('Map with array value, prepend', () => {
		var map	= [
			{
				a: [
					createRoute('a1', ['a']),
					createRoute('a2', ['a'])
				]
			}
		];
		
		var original	= clone(map);
		var route		= createRoute('b', ['a']);
		
		assertMap(
			[
				{
					a: [
						route,
						...(original[0].a)
					]
				}
			],
			Mapper.mergeWithArray(map, MapCursor.createPrependCursor(route))
		);
	});
	
	test('Map with a map inside, appended', () => {
		var map	= [
			{
				a: {
					b: createRoute('a', ['a', 'b'])
				}
			}
		];
		
		var original	= clone(map);
		var route		= createRoute('b', ['a', 'b']);
		
		assertMap(
			[
				{
					a: {
						b: [
							original[0].a.b,
							route
						]
					}
				}
			],
			Mapper.mergeWithArray(map, MapCursor.createAppendCursor(route))
		);
	});
	
	test('Map with a map inside, prepend', () => {
		var map	= [
			{
				a: {
					b: createRoute('a', ['a', 'b'])
				}
			}
		];
		
		var original	= clone(map);
		var route		= createRoute('b', ['a', 'b']);
		
		assertMap(
			[
				{
					a: {
						b: [
							route,
							original[0].a.b
						]
					}
				}
			],
			Mapper.mergeWithArray(map, MapCursor.createPrependCursor(route))
		);
	});
	
	test('Map with a map inside with long path, appended', () => {
		var map	= [
			{
				a: {
					b: createRoute('a', ['a', 'b', 'c', 'd', 'e'])
				}
			}
		];
		
		var original	= clone(map);
		var route		= createRoute('b', ['a', 'b', 'c', 'd', 'e']);
		
		assertMap(
			[
				{
					a: { b: { c: { d: { e: 
						[
							original[0].a.b,
							route
						]
					} } } } 
				}
			],
			Mapper.mergeWithArray(map, MapCursor.createAppendCursor(route))
		);
	});
	
	test('Map with a map inside with long path, prepend', () => {
		var map	= [
			{
				a: {
					b: createRoute('b', ['a', 'b', 'c', 'd', 'e'])
				}
			}
		];
		
		var original	= clone(map);
		var route		= createRoute('b', ['a', 'b', 'c', 'd', 'e']);
		
		assertMap(
			[
				{
					a: { b: { c: { d: { e: 
						[
							route,
							original[0].a.b
						]
					} } } } 
				}
			],
			Mapper.mergeWithArray(map, MapCursor.createPrependCursor(route))
		);
	});
	
	test('Route inside a map with different path, appended', () => {
		var map	= [
			{
				a: createRoute('a', ['a', 'b'])
			}
		];
		
		var original	= clone(map);
		var route		= createRoute('b', ['a', 'c']);
		
		assertMap(
			[
				{
					a: {
						b: original[0].a,
						c: route
					}
				}
			],
			Mapper.mergeWithArray(map, MapCursor.createAppendCursor(route))
		);
	});
	
	test('Route inside a map with different path, prepend', () => {
		var map	= [
			{
				a: createRoute('a', ['a', 'b'])
			}
		];
		
		var original	= clone(map);
		var route		= createRoute('b', ['a', 'c']);
		
		assertMap(
			[
				{
					a: {
						b: original[0].a,
						c: route
					}
				}
			],
			Mapper.mergeWithArray(map, MapCursor.createPrependCursor(route))
		);
	});
	
	test('Route inside a map with deeper path, appended', () => {
		var map	= [
			{
				a: createRoute('a', ['a', 'b', 'c'])
			}
		];
		
		var original	= clone(map);
		var route		= createRoute('b', ['a', 'b']);
		
		assertMap(
			[
				{
					a: {
						b: [
							original[0].a,
							route
						]
					}
				}
			],
			Mapper.mergeWithArray(map, MapCursor.createAppendCursor(route))
		);
	});
	
	test('Route inside a map with deeper path, prepend', () => {
		var map	= [
			{
				a: createRoute('a', ['a', 'b', 'c'])
			}
		];
		
		var original	= clone(map);
		var route		= createRoute('b', ['a', 'b']);
		
		assertMap(
			[
				{
					a: {
						b: [
							route,
							original[0].a
						]
					}
				}
			],
			Mapper.mergeWithArray(map, MapCursor.createPrependCursor(route))
		);
	});
	
	test('Route inside a map with shorter path, appended', () => {
		var map	= [
			{
				a: createRoute('a', ['a', 'b'])
			}
		];
		
		var original	= clone(map);
		var route		= createRoute('b', ['a', 'b', 'c']);
		
		assertMap(
			[
				{
					a: {
						b: [
							original[0].a,
							route
						]
					}
				}
			],
			Mapper.mergeWithArray(map, MapCursor.createAppendCursor(route))
		);
	});
	
	test('Route inside a map with shorter path, prepend', () => {
		var map	= [
			{
				a: createRoute('a', ['a', 'b'])
			}
		];
		
		var original	= clone(map);
		var route		= createRoute('b', ['a', 'b', 'c']);
		
		assertMap(
			[
				{
					a: {
						b: [
							route,
							original[0].a
						]
					}
				}
			],
			Mapper.mergeWithArray(map, MapCursor.createPrependCursor(route))
		);
	});
	
	test('Route inside a map with no path, appended', () => {
		var map	= [
			{
				a: createRoute('a', ['a'])
			}
		];
		
		var original	= clone(map);
		var route		= createRoute('b', ['a', 'b']);
		
		assertMap(
			[
				{
					a: [
						original[0].a,
						route
					]
				}
			],
			Mapper.mergeWithArray(map, MapCursor.createAppendCursor(route))
		);
	});
	
	test('Route inside a map with no path, prepend', () => {
		var map	= [
			{
				a: createRoute('a', ['a'])
			}
		];
		
		var original	= clone(map);
		var route		= createRoute('b', ['a', 'b']);
		
		assertMap(
			[
				{
					a: [
						route,
						original[0].a
					]
				}
			],
			Mapper.mergeWithArray(map, MapCursor.createPrependCursor(route))
		);
	});
	
	test('Route inside a map with new route without path, appended', () => {
		var map	= [
			{
				a: createRoute('a', ['a', 'b'])
			}
		];
		
		var original	= clone(map);
		var route		= createRoute('b', ['a']);
		
		assertMap(
			[
				{
					a: [
						original[0].a,
						route
					]
				}
			],
			Mapper.mergeWithArray(map, MapCursor.createAppendCursor(route))
		);
	});
	
	test('Route inside a map with new route without path, prepend', () => {
		var map	= [
			{
				a: createRoute('a', ['a', 'b'])
			}
		];
		
		var original	= clone(map);
		var route		= createRoute('b', ['a']);
		
		assertMap(
			[
				{
					a: [
						route,
						original[0].a
					]
				}
			],
			Mapper.mergeWithArray(map, MapCursor.createPrependCursor(route))
		);
	});
	
	
	test('No routes, appended', () => {
		var map	= [
			createRoute('a', [])
		];
		
		var original	= clone(map);
		var route		= createRoute('b', []);
		
		assertMap(
			[
				original[0],
				route
			],
			Mapper.mergeWithArray(map, MapCursor.createAppendCursor(route))
		);
	});
	
	test('No routes, prepend', () => {
		var map	= [
			createRoute('a', [])
		];
		
		var original	= clone(map);
		var route		= createRoute('b', []);
		
		assertMap(
			[
				route,
				original[0]
			],
			Mapper.mergeWithArray(map, MapCursor.createPrependCursor(route))
		);
	});
	
	test('No matching routes, appended', () => {
		var map	= [
			createRoute('a', ['a'])
		];
		
		var original	= clone(map);
		var route		= createRoute('b', ['b']);
		
		assertMap(
			[
				{
					a: original[0],
					b: route
				}
			],
			Mapper.mergeWithArray(map, MapCursor.createAppendCursor(route))
		);
	});
	
	test('No matching routes, prepend', () => {
		var map	= [
			createRoute('a', ['a'])
		];
		
		var original	= clone(map);
		var route		= createRoute('b', ['b']);
		
		assertMap(
			[
				{
					a: original[0],
					b: route
				}
			],
			Mapper.mergeWithArray(map, MapCursor.createPrependCursor(route))
		);
	});
	
	
	
	test('Invalid element, error thrown', () => {
		var map	= [
			123
		];
		
		assert.throws(() => {
			Mapper.mergeWithArray(map, MapCursor.createPrependCursor(createRoute('a', ['a'])))
		});
	});
});