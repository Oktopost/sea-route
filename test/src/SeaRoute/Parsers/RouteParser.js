'use strict';


const SeaRoute = require('../../../index');


const Param			= SeaRoute.ParamType.Param;
const Path			= SeaRoute.Route.Path;
const Route			= SeaRoute.Route.Route;
const RouteParser	= SeaRoute.Parsers.RouteParser;

const assert = require('chai').assert;


suite('RouteParser', () => {
	test('route object returned', () => {
		var route = RouteParser.parse({
			path: '/',
			params: {},
			callback: () => {}
		}, {});
		
		assert.instanceOf(route, Route);
	});
	
	test('callback passed', () => {
		var isCalled = false;
		var route = RouteParser.parse({
			path: '/',
			params: {},
			callback: () => { isCalled = true; }
		}, {});
		
		route.handle(['/'], {});
		
		assert.isTrue(isCalled);
	});
	
	
	suite('validation', () => {
		test('missing callback, error thrown', () => {
			assert.throws(() => {
				RouteParser.parse({
					path: '/',
					params: {}
				}, {});
			});
		});
		
		test('missing path, error thrown', () => {
			assert.throws(() => {
				RouteParser.parse({
					params: {},
					callback: () => {}
				}, {});
			});
		});
		
		test('missing params, object created', () => {
			var obj = {
				path: '/',
				callback: () => {}
			};
			
			RouteParser.parse(obj, {});
			
			assert.isDefined(obj.params);
		});
	});
	
	
	suite('path', () => {
		test('path object created /', () => {
			var route = RouteParser.parse({
				path: '/',
				params: {},
				callback: () => {}
			}, {});
			
			assert.equal('/', route.pathText());
			assert.instanceOf(route.path(), Path);
		});
		
		test('const only single path /a', () => {
			var route = RouteParser.parse({
				path: '/a',
				params: {},
				callback: () => {}
			}, {});
			
			assert.equal('/a', route.path().text());
			assert.equal(1, route.path().parts().length);
			assert.equal('a', route.path().parts()[0].text());
		});
		
		test('const only long path /a/b/c', () => {
			var route = RouteParser.parse({
				path: '/a/b/c',
				params: {},
				callback: () => {}
			}, {});
			
			assert.equal('/a/b/c', route.path().text());
			assert.equal(3, route.path().parts().length);
			assert.equal('a', route.path().parts()[0].text());
			assert.equal('b', route.path().parts()[1].text());
			assert.equal('c', route.path().parts()[2].text());
		});
		
		test('path with long name /a/long_name/c', () => {
			var route = RouteParser.parse({
				path: '/a/long_name/c',
				params: {},
				callback: () => {}
			}, {});
			
			assert.equal('/a/long_name/c', route.path().text());
			assert.equal(3, route.path().parts().length);
			assert.equal('long_name', route.path().parts()[1].text());
		});
		
		test('path with parameter /a/{a}/c', () => {
			var params = {};
			var route = RouteParser.parse({
				path: '/a/{a}/c',
				params: params,
				callback: () => {}
			}, {});
			
			assert.equal('/a/{a}/c', route.path().text());
			assert.equal(3, route.path().parts().length);
			assert.equal('{a}', route.path().parts()[1].text());
			assert.isFalse(route.path().parts()[1].isConst());
			assert.equal(params.a, route.path().parts()[1].getParam());
		});
		
		test('path with configured parameter /a/{a|/12/}/c', () => {
			var params = {};
			var route = RouteParser.parse({
				path: '/a/{a|/12/}/c',
				params: params,
				callback: () => {}
			}, {});
			
			assert.equal('/a/{a|/12/}/c', route.path().text());
			assert.equal('{a|/12/}', route.path().parts()[1].text());
			assert.isFalse(route.path().parts()[1].isConst());
			assert.equal(params.a, route.path().parts()[1].getParam());
		});
		
		test('invalid path, error thrown /{ad', () => {
			assert.throws(() => {
				RouteParser.parse({
					path: '/{ad',
					params: {},
					callback: () => {}
				}, {});
			});
		});
		
		test('path not starts with a slah a/b', () => {
			var route = RouteParser.parse({
				path: 'a/b',
				params: {},
				callback: () => {}
			}, {});
			
			assert.equal('/a/b', route.path().text());
			assert.equal(2, route.path().parts().length);
			assert.equal('a', route.path().parts()[0].text());
			assert.equal('b', route.path().parts()[1].text());
		});
	});
	
	suite('params', () => {
		test('no params passed', () => {
			var route = RouteParser.parse({
				path: '/a',
				params: {},
				callback: () => {}
			}, {});
			
			assert.isFalse(route.hasQueryParams());
		});
		
		test('path param exists, no query params', () => {
			var route = RouteParser.parse({
				path: '/{a}',
				params: { a: {} },
				callback: () => {}
			}, {});
			
			assert.isFalse(route.hasQueryParams());
		});
		
		test('param not defined in path used as query param', () => {
			var route = RouteParser.parse({
				path: '/a',
				params: { a: {} },
				callback: () => {}
			}, {});
			
			assert.isTrue(route.hasQueryParams());
		});
		
		test('params parsed', () => {
			var params = { a: {}, b: 'abc', c: /abc/ };
			var route = RouteParser.parse({
				path: '/a',
				params: params,
				callback: () => {}
			}, {});
			
			assert.instanceOf(params.a, Param);
			assert.instanceOf(params.b, Param);
			assert.instanceOf(params.c, Param);
		});
	});
});