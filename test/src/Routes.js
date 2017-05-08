'use strict';


const SeaRoute = require('../../index');


const is = require('oktopost-plankton').is;
const obj = require('oktopost-plankton').obj;

const Path		= SeaRoute.route.Path;
const Route		= SeaRoute.route.Route;
const Routes	= SeaRoute.Routes;

const assert = require('chai').assert;


suite.only('Routes', () => {
	
	function _create(path) {
		path = path || '/';
		return new Route(new Path(path), () => {});
	}
	
	
	test('(Route) - same route returned', () => {
		var route = _create();
		assert.equal(route, Routes.create(route));
	});
	
	test('([Route, Route]) - same routes returned', () => {
		var route1 = _create();
		var route2 = _create();
		
		var result = Routes.create([route1, route2]);
		
		assert.equal(route1, result[0]);
		assert.equal(route2, result[1]);
	});
	
	test('(string path, callback) - single route constructed', () => {
		var isCalled = false;
		var result = Routes.create('/a', () => { isCalled = true });
		
		
		assert.instanceOf(result, Route);
		assert.equal('/a', result.pathText());
		
		
		result.handle(['a'], {});
		assert.isTrue(isCalled);
	});
	
	test('(string path, object config, callback) - single route constructed', () => {
		var isCalled = false;
		var result = Routes.create('/a', {}, () => { isCalled = true });
		
		
		assert.instanceOf(result, Route);
		assert.equal('/a', result.pathText());
		
		
		result.handle(['a'], {});
		assert.isTrue(isCalled);
	});
	
	test('(string path, object config) - single route constructed', () => {
		var isCalled = false;
		var result = Routes.create('/a', { callback: () => { isCalled = true } });
		
		
		assert.instanceOf(result, Route);
		assert.equal('/a', result.pathText());
		
		
		result.handle(['a'], {});
		assert.isTrue(isCalled);
	});
	
	test('(object config, callback) - single route constructed', () => {
		var isCalled = false;
		var result = Routes.create({ path: '/a' }, () => { isCalled = true });
		
		assert.instanceOf(result, Route);
		assert.equal('/a', result.pathText());
		
		
		result.handle(['a'], {});
		assert.isTrue(isCalled);
	});
	
	test('(object config) - single route constructed', () => {
		var isCalled = false;
		var result = Routes.create({ path: '/a', callback: () => { isCalled = true } });
		
		assert.instanceOf(result, Route);
		assert.equal('/a', result.pathText());
		
		
		result.handle(['a'], {});
		assert.isTrue(isCalled);
	});
	
	test('({ a: object, b: object }) - object with routes constructed', () => {
		var isCalled = false;
		var result = Routes.create(
			{ 
				a: { 
					path: '/a', 
					callback: () => {} 
				}, 
				b: {
					path: '/b',
					callback: () => {}
				}
			});
		
		assert.isFalse(is.array(result));
		assert.deepEqual(['a', 'b'], obj.keys(result));
		
		assert.instanceOf(Route, result.a);
		assert.equal('/a', result.a.pathText());
		
		assert.instanceOf(Route, result.b);
		assert.equal('/b', result.b.pathText());
	});
	
	test('({ path: object }) - key used as path', () => {
		var isCalled = false;
		var result = Routes.create(
			{ 
				'a': {  
					callback: () => {} 
				}
			});
		
		assert.deepEqual(['a'], obj.keys(result));
		assert.instanceOf(Route, result.a);
		assert.equal('/a', result.a.pathText());
	});
	
	test('({ a: { b: object } }) - Deep route constructed', () => {
		var isCalled = false;
		var result = Routes.create(
			{ 
				'a': {
					'b': {
						path: 'somepath',
						callback: () => {}
					}
				}
			});
		
		assert.deepEqual(['a'], obj.keys(result));
		assert.deepEqual(['b'], obj.keys(result.a));
		assert.instanceOf(Route, result.a.b);
		assert.equal('/somepath', result.a.b.pathText());
	});
	
	
	test('(object config, callback), missing path - error thrown', () => {
		assert.throws(() => {
			Routes.create({  }, () => {});
		});
	});
	
	test('(object config), missing path - error thrown', () => {
		assert.throws(() => {
			Routes.create({  callback: () => {} });
		});
	});
	
	test('(object config), missing callback - error thrown', () => {
		assert.throws(() => {
			Routes.create({ path: '/' });
		});
	});
	
	test('(invalid parameter) - error thrown', () => {
		assert.throws(() => {
			Routes.create(123);
		});
	});
	
	test('(string path) - error thrown', () => {
		assert.throws(() => {
			Routes.create('/abc');
		});
	});
});