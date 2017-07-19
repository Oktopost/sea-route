'use strict';


const SeaRoute = require('../../index');


const is = namespace().Plankton.is;

const Path		= SeaRoute.Route.Path;
const Route		= SeaRoute.Route.Route;
const Router	= SeaRoute.Router;

const assert = require('chai').assert;


suite('Router', () => {
	suite('handle', () => {
		test('Empty router - miss called', () => {
			var isCalled = false;
			var subject = new Router(() => {}, (url) => { isCalled = true; });
			
			subject.handle('');
			
			assert.isTrue(isCalled);
		});
		
		test('On miss url passed to miss handler', () => {
			var calledUrl = false;
			var subject = new Router(() => {}, (url) => { calledUrl = url; });
			
			subject.handle('/a');
			
			assert.equal('/a', calledUrl);
		});
		
		test('On miss url passed to miss handler', () => {
			var calledUrl = false;
			var subject = new Router(() => {}, (url) => { calledUrl = url; });
			
			subject.handle('/a');
			
			assert.equal('/a', calledUrl);
		});
		
		test('On miss without miss handler, error thrown', () => {
			var subject = new Router(() => {});
			
			assert.throws(() => { subject.handle('/a'); });
		});
		
		test('Matching router called', () => {
			var isCalled = false;
			var subject = new Router(() => {});
			
			subject.appendRoutes({
				path:		'/',
				callback:	() => { isCalled = true; }
			});
			
			subject.handle('/');
			
			assert.isTrue(isCalled);
		});
		
		test('Few routes matching, first called', () => {
			var isCalled = false;
			var subject = new Router(() => {});
			
			subject.appendRoutes(
				{
					path:		'/',
					callback:	() => { isCalled = true; }
				},
				{
					path:		'/',
					callback:	() => { isCalled = false; }
				});
			
			subject.handle('/');
			
			assert.isTrue(isCalled);
		});
		
		test('Few routes defined but none match, miss called', () => {
			var isMissCalled = false;
			var subject = new Router(() => {}, () => { isMissCalled = true; });
			
			subject.appendRoutes([
					{
						path:		'/a',
						callback:	() => { isMissCalled = false; }
					},
					{
						path:		'/b',
						callback:	() => { isMissCalled = false; }
					}
				]);
			
			subject.handle('/c');
			
			assert.isTrue(isMissCalled);
		});
		
		test('One of few routes match', () => {
			var isCalled = false;
			var subject = new Router(() => {});
			
			subject.appendRoutes([
					{
						path:		'/a',
						callback:	() => { isCalled = false; }
					},
					{
						path:		'/b',
						callback:	() => { isCalled = true; }
					},
					{
						path:		'/c',
						callback:	() => { isCalled = false; }
					}
				]);
			
			subject.handle('/b');
			
			assert.isTrue(isCalled);
		});
		
		test('Trailing slash missing, route still match', () => {
			var isCalled = false;
			var subject = new Router(() => {});
			
			subject.appendRoutes(
				{
					path:		'/b',
					callback:	() => { isCalled = true; }
				}
			);
			
			subject.handle('b');
			
			assert.isTrue(isCalled);
		});
		
		test('Complex path matches', () => {
			var isCalled = false;
			var subject = new Router(() => {});
			
			subject.appendRoutes(
				{
					path:		'/a/b/c/d/e',
					callback:	() => { isCalled = true; }
				}
			);
			
			subject.handle('/a/b/c/d/e');
			
			assert.isTrue(isCalled);
		});
		
		test('Path with query params matches', () => {
			var isCalled = false;
			var subject = new Router(() => {});
			
			subject.appendRoutes(
				{
					path:		'/a',
					callback:	() => { isCalled = true; }
				}
			);
			
			subject.handle('/a?b=1');
			
			assert.isTrue(isCalled);
		});
		
		test('Query params passed to route', () => {
			var params = false;
			var subject = new Router(() => {});
			
			subject.appendRoutes(
				{
					path:		'/a',
					params:		{ b: { type: 'int' } }, 
					callback:	(calledParams) => { params = calledParams; }
				}
			);
			
			subject.handle('/a?b=1');
			
			assert.deepEqual({b: 1}, params);
		});
		
		test('Path params passed to route', () => {
			var params = false;
			var subject = new Router(() => {});
			
			subject.appendRoutes(
				{
					path:		'/a/{b}',
					params:		{ b: { type: 'int' } }, 
					callback:	(calledParams) => { params = calledParams; }
				}
			);
			
			subject.handle('/a/1');
			
			assert.deepEqual({b: 1}, params);
		});
	});
	
	
	suite('link', () => {
		test('String passed, url created', () => {
			var subject = new Router(() => {});
			assert.equal('/a/1', subject.link('/a/{b}', { b: 1 }));
		});
		
		test('Route passed, url created', () => {
			var subject = new Router(() => {});
			var path = new Path('/a');
			var route = new Route(path, () => {});
			
			path.addPart(new SeaRoute.Route.Part('a'));
			route.addQueryParam(new SeaRoute.ParamType.Param('b'));
			
			assert.equal('/a?b=1', subject.link(route, { b: 1 }));
		});
		
		test('Invalid input, error thrown', () => {
			var subject = new Router(() => {});
			assert.throws(() => { subject.link(true); });
		});
	});
	
	suite('navigate', () => {
		test('link passed to navigator', () => {
			var link = '';
			var subject = new Router((l) => { link = l; });
			subject.navigate('/a/{b}', { b: 1 });
			
			assert.equal('/a/1', link);
		});
	});
	
	
	suite('SANITY', () => {
		test('handle', () => {
			var paramsAB = false;
			var paramsCD = false;
			var paramsA4Test = false;
			var subject = new Router(() => {});
			
			subject.addParams({
				pre_def: {
					type: 'int'
				}
			});
			
			subject.appendRoutes({
				'/a': {
					callback: () => {}
				},
				'/{b}': {
					params:	{ 
						b: { type: 'int' }
					}, 
					
					callback: () => {}
				},
				'/{c}/{d}': {
					params:	{ 
						c: /b/i,
						d: { optional: true	}
					},
					callback:(p) => { paramsCD = p; }
				},
				'/a/1': {
					callback:() => {}
				},
				'/a/2': {
					callback:() => {}
				},
				'/a/{b}': {
					params: { b: /[a-z]*/i },
					callback:(p) => { paramsAB = p; }
				},
				'/a/4/test/1': {
					callback:(p) => {}
				},
				'/a/4/test/2': {
					callback:(p) => {}
				},
				'/a/4': {
					callback:(p) => {}
				},
				'/a/4/test/Pre': {
					callback:() => {}
				},
				'/a/4/test/{prm|[pre_def]}': {
				},
				'/a/4/test/Post': {
					callback:() => {}
				},
				
			});
			
			subject.handle('/a/nnn?a=5');
			assert.deepEqual({b: 'nnn', a: '5'}, paramsAB);
			
			subject.handle('/b');
			assert.deepEqual({c: 'b', d: undefined}, paramsCD);
			
			subject.handle('/a/4/test/123');
			assert.deepEqual({prm: 123}, paramsA4Test);
		});
	});
});