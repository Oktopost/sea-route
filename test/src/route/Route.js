'use strict';


const SeaRoute = require('../../../index');

const Param	= SeaRoute.params.Param;
const Part	= SeaRoute.route.Part;
const Path	= SeaRoute.route.Path;
const Route	= SeaRoute.route.Route;

const assert = require('chai').assert;


suite('Route', () => {

	/**
	 * @return {SeaRoute.route.Route}
	 */
	function create() {
		return new Route(new Path('/'), () => {});
	}

	/**
	 * @return {SeaRoute.route.Route}
	 */
	function createWithAPart(callback) {
		var calledParams;
		var path = new Path('/{a}');
		var route = new Route(path, callback);
		
		var param = new Param('a');
		path.addPart((new Part('{a}')).setParam(param));
		
		return route;
	}
	
	
	test('hasQueryParams', () => { 
		var route = create();
		assert.isFalse(route.hasQueryParams());
		
		route.addQueryParam(new Param('a'));
		assert.isTrue(route.hasQueryParams());
	});
	
	test('path', () => {
		var route = create();
		assert.instanceOf(route.path(), Path);
	});
	
	test('pathText', () => {
		var route = new Route(new Path('p_text'), () => {});
		assert.equal('p_text', route.pathText());
	});
	
	test('isMatching', () => {
		var calledWith = null;
		
		var route = new Route({ isMatching: (a) => { calledWith = a; return true }}, () => {});
		
		assert.isTrue(route.isMatching(['a', 'b']));
		assert.deepEqual(['a', 'b'], calledWith);
		
		var routeNotMatching = new Route({ isMatching: () => false }, () => {});
		assert.isFalse(routeNotMatching.isMatching([]));
	});
	
	
	suite('handle', () => {
		test('empty data', () => {
			var calledParams;
			var route = new Route(new Path('a'), (params) => { calledParams = params; });
			
			route.handle([], {});
			
			assert.deepEqual({}, calledParams);
		});
		
		test('Query params passed', () => {
			var calledParams;
			var route = new Route(new Path('a'), (params) => { calledParams = params; });
			
			route.handle([], {a: '1', b: '2'});
			
			assert.deepEqual({a: '1', b: '2'}, calledParams);
		});
		
		test('Path params passed', () => {
			var calledParams;
			var route = createWithAPart((params) => { calledParams = params; });
			
			route.handle(['val'], {});
			
			assert.deepEqual({a: 'val'}, calledParams);
		});
		
		test('Path param not overridden by query param', () => {
			var calledParams;
			var route = createWithAPart((params) => { calledParams = params; });
			
			route.handle(['val'], {a: 'other'});
			
			assert.deepEqual({a: 'val'}, calledParams);
		});
		
		test('Path params and query params combined', () => {
			var calledParams;
			var route = createWithAPart((params) => { calledParams = params; });
			
			route.handle(['val'], {b: 'other'});
			
			assert.deepEqual({a: 'val', b: 'other'}, calledParams);
		});
		
		test('Invalid input, error thrown', () => {
			var route = create();
			var param = new Param('n');
			
			param.setIsOptional(false);
			route.addQueryParam(param);
			
			assert.throws(() => {
				route.handle([], {});
			});
		});
	});
	
	suite('buildPath', () => {
		test('no data', () => {
			var route = create();
			assert.equal('/', route.buildPath({}));
		});
		
		test('const path', () => {
			var path = new Path('/a');
			var route = new Route(path, () => {});
			
			path.addPart(new Part('a'));
			
			assert.equal('/a', route.buildPath({}));
		});
		
		test('Parameter path', () => {
			var route = createWithAPart(() => {});
			assert.equal('/123', route.buildPath({a: 123}));
		});
		
		test('Query parameters appended', () => {
			var route = create();
			
			route.addQueryParam(new Param('b'));
			
			assert.equal('/?b=123', route.buildPath({b: 123}));
		});
		
		test('Optional parameters not used, no parameters appended', () => {
			var route = create();
			
			route.addQueryParam((new Param('b')).setIsOptional(true));
			
			assert.equal('/', route.buildPath({}));
		});
	});
});