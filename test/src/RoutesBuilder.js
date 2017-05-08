'use strict';


const SeaRoute = require('../../index');


const is = require('oktopost-plankton').is;
const obj = require('oktopost-plankton').obj;

const Path		= SeaRoute.route.Path;
const Route		= SeaRoute.route.Route;
const RoutesBuilder	= SeaRoute.RoutesBuilder;

const assert = require('chai').assert;


suite('RoutesBuilder', () => {
	
	function _create(path) {
		path = path || '/';
		return new Route(new Path(path), () => {});
	}
	
	
	test('(Route) - same route returned', () => {
		var route = _create();
		assert.equal(route, (new RoutesBuilder()).create(route));
	});
	
	test('([Route, Route]) - same routes returned', () => {
		var route1 = _create();
		var route2 = _create();
		
		var result = (new RoutesBuilder()).create([route1, route2]);
		
		assert.equal(route1, result[0]);
		assert.equal(route2, result[1]);
	});
	
	test('(string path, callback) - single route constructed', () => {
		var isCalled = false;
		var result = (new RoutesBuilder()).create('/a', () => { isCalled = true });
		
		
		assert.instanceOf(result, Route);
		assert.equal('/a', result.pathText());
		
		
		result.handle(['a'], {});
		assert.isTrue(isCalled);
	});
	
	test('(string path, object config, callback) - single route constructed', () => {
		var isCalled = false;
		var result = (new RoutesBuilder()).create('/a', {}, () => { isCalled = true });
		
		
		assert.instanceOf(result, Route);
		assert.equal('/a', result.pathText());
		
		
		result.handle(['a'], {});
		assert.isTrue(isCalled);
	});
	
	test('(string path, object config) - single route constructed', () => {
		var isCalled = false;
		var result = (new RoutesBuilder()).create('/a', { callback: () => { isCalled = true } });
		
		
		assert.instanceOf(result, Route);
		assert.equal('/a', result.pathText());
		
		
		result.handle(['a'], {});
		assert.isTrue(isCalled);
	});
	
	test('(string path, { params: a, callback }) - params defined in config used', () => {
		var result = (new RoutesBuilder()).create('/{a}', { params: { a: /abc/ },  callback: () => {} });
		assert.instanceOf(result.path().parts()[0].getParam(), SeaRoute.params.RegexParam)
	});
	
	test('(object config, callback) - single route constructed', () => {
		var isCalled = false;
		var result = (new RoutesBuilder()).create({ path: '/a' }, () => { isCalled = true });
		
		assert.instanceOf(result, Route);
		assert.equal('/a', result.pathText());
		
		
		result.handle(['a'], {});
		assert.isTrue(isCalled);
	});
	
	test('(object config) - single route constructed', () => {
		var isCalled = false;
		var result = (new RoutesBuilder()).create({ path: '/a', callback: () => { isCalled = true } });
		
		assert.instanceOf(result, Route);
		assert.equal('/a', result.pathText());
		
		
		result.handle(['a'], {});
		assert.isTrue(isCalled);
	});
	
	test('({ a: object, b: object }) - object with routes constructed', () => {
		var isCalled = false;
		var result = (new RoutesBuilder()).create(
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
		
		assert.instanceOf(result.a, Route);
		assert.equal('/a', result.a.pathText());
		
		assert.instanceOf(result.b, Route);
		assert.equal('/b', result.b.pathText());
	});
	
	test('({ path: object }) - key used as path', () => {
		var isCalled = false;
		var result = (new RoutesBuilder()).create(
			{ 
				'a': {  
					callback: () => {} 
				}
			});
		
		assert.deepEqual(['a'], obj.keys(result));
		assert.instanceOf(result.a, Route);
		assert.equal('/a', result.a.pathText());
	});
	
	test('({ a: { b: object } }) - Deep route constructed', () => {
		var isCalled = false;
		var result = (new RoutesBuilder()).create(
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
		assert.instanceOf(result.a.b, Route);
		assert.equal('/somepath', result.a.b.pathText());
	});
	
	
	test('predefined parameter used', () => {
		var predefined = { a: new SeaRoute.params.RegexParam('a', /a/) };
		var builder = new RoutesBuilder(predefined);
		
		var result = builder.create('/{a|[a]}', { callback: () => {} });
		var param = result.path().parts()[0].getParam();
		
		assert.instanceOf(param, SeaRoute.params.PredefinedParamDecorator);
		assert.isTrue(param.validate('a'));
		assert.isFalse(param.validate('b'));
	});
	
	
	suite('addParams', () => {
		test('Predefined parameter appender later', () => {
			var predefined = { a: new SeaRoute.params.RegexParam('a', /a/) };
			var builder = new RoutesBuilder();
			
			builder.addParams(predefined);
			
			var result = builder.create('/{a|[a]}', { callback: () => {} });
			var param = result.path().parts()[0].getParam();
			
			assert.instanceOf(param, SeaRoute.params.PredefinedParamDecorator);
		});
		
		test('Single parametre added ', () => {
			var predefined = new SeaRoute.params.RegexParam('a', /a/);
			var builder = new RoutesBuilder();
			
			builder.addParams(predefined);
			
			var result = builder.create('/{a|[a]}', { callback: () => {} });
			var param = result.path().parts()[0].getParam();
			
			assert.instanceOf(param, SeaRoute.params.PredefinedParamDecorator);
		});
		
		test('Parameter already defined, throw error', () => {
			var predefined = new SeaRoute.params.RegexParam('a', /a/);
			var builder = new RoutesBuilder();
			
			builder.addParams(predefined);
			
			assert.throws(() => { builder.addParams(predefined); });
		});
	});
	
	
	test('(object config, callback), missing path - error thrown', () => {
		assert.throws(() => {
			(new RoutesBuilder()).create({  }, () => {});
		});
	});
	
	test('(object config), missing path - error thrown', () => {
		assert.throws(() => {
			(new RoutesBuilder()).create({  callback: () => {} });
		});
	});
	
	test('(object config), missing callback - error thrown', () => {
		assert.throws(() => {
			(new RoutesBuilder()).create({ path: '/' });
		});
	});
	
	test('(invalid parameter) - error thrown', () => {
		assert.throws(() => {
			(new RoutesBuilder()).create(123);
		});
	});
	
	test('(string path) - error thrown', () => {
		assert.throws(() => {
			(new RoutesBuilder()).create('/abc');
		});
	});
});