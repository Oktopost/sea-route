'use strict';


const SeaRoute = require('../../../index');

const Param			= SeaRoute.ParamType.Param;
const CallbackParam	= SeaRoute.ParamType.CallbackParam;
const Query			= SeaRoute.Route.Query;

const assert = require('chai').assert;


suite('Query', () => {
	
	test('isEmpty', () => { 
		var query = new Query();
		assert.isTrue(query.isEmpty());
		
		query.add(new Param('a'));
		assert.isFalse(query.isEmpty());
	});
	
	test('count', () => { 
		var query = new Query();
		assert.equal(0, query.count());
		
		query.add(new Param('a'));
		query.add(new Param('b'));
		assert.equal(2, query.count());
	});
	
	
	suite('parseQuery', () => {
		test('Empty data', () => {
			var query = new Query(); 
			assert.deepEqual({}, query.parseQuery({}));
		});
		
		test('Parameter not defined, same value passed', () => {
			var query = new Query(); 
			assert.deepEqual({a: 'a'}, query.parseQuery({a: 'a'}));
		});
		
		test('Parameter not defined in strict mode, parameter not in result', () => {
			var query = new Query();
			query.setStrict();
			assert.deepEqual({}, query.parseQuery({a: 'a'}));
		});
		
		test('Parameter with default value, default value appended', () => {
			var query = new Query();
			var param = new Param('a');
			
			param.setDefaultValue(123);
			query.add(param);
			
			assert.deepEqual({a: 123}, query.parseQuery({}));
		});
		
		test('Missing optional parameter', () => {
			var query = new Query();
			var param = new Param('a');
			
			param.setIsOptional(true);
			query.add(param);
			
			assert.deepEqual({}, query.parseQuery({}));
		});
		
		test('Missing required parameter, error thrown', () => {
			var query = new Query();
			var param = new Param('a');
			
			param.setIsOptional(false);
			query.add(param);
			
			assert.throws(() => {
				query.parseQuery({});
			});
		});
		
		test('Value for defined parameter passed to parameter', () => {
			var query = new Query();
			var calledWith = null;
			var param = new CallbackParam('a', { extract: (a) => { calledWith = a; return 1; }});
			
			query.add(param);
			query.parseQuery({a: '123'});
			
			assert.equal('123', calledWith);
		});
		
		test('Returned value by parameter appended to result', () => {
			var query = new Query();
			var param = new CallbackParam('a', { extract: () => { return 123; }});
			
			query.add(param);
			assert.deepEqual({'a': 123}, query.parseQuery({a: '123'}));
		});
		
		test('Add multiple parameters', () => {
			var query = new Query();
			var param1 = new CallbackParam('a', { extract: () => { return 123; }});
			var param2 = new Param('b');
			
			param2.setDefaultValue('hello world');
			
			query.add([param1, param2]);
			
			assert.deepEqual({'a': 123, 'b': 'hello world'}, query.parseQuery({a: '123'}));
		});
	});
	
	suite('parseParameters', () => {
		test('Empty data', () => {
			var query = new Query(); 
			assert.deepEqual({}, query.parseParameters({}));
		});
		
		test('Parameter not defined, value ignored', () => {
			var query = new Query();
			assert.deepEqual({}, query.parseParameters({a: 'a'}));
		});
		
		test('Parameter defined in strict mode, no error thrown', () => {
			var query = new Query();
			var param = new Param('a');
			
			query.add(param);
			query.setStrict();
			
			query.parseParameters({a: 'a'});
		});
		
		test('Parameter not defined in strict mode, error thrown', () => {
			var query = new Query(); 
			
			query.setStrict();
			
			assert.throws(() => {
				query.parseParameters({a: 'a'});
			});
		});
		
		test('Parameter set to auto fill URL', () => {
			var query = new Query();
			var param = new Param('a');
			
			param.setDefaultValue(123);
			param.setIsAutoFillURL(true);
			query.add(param);
			
			assert.deepEqual({a: '123'}, query.parseParameters({}));
		});
		
		test('Parameter with default value but not auto fill', () => {
			var query = new Query();
			var param = new Param('a');
			
			param.setDefaultValue(123);
			param.setIsAutoFillURL(false);
			query.add(param);
			
			assert.deepEqual({}, query.parseParameters({}));
		});
		
		test('Missing optional parameter', () => {
			var query = new Query();
			var param = new Param('a');
			
			param.setIsOptional(true);
			query.add(param);
			
			assert.deepEqual({}, query.parseParameters({}));
		});
		
		test('Missing required parameter, error thrown', () => {
			var query = new Query();
			var param = new Param('a');
			
			param.setIsOptional(false);
			query.add(param);
			
			assert.throws(() => {
				query.parseParameters({});
			});
		});
		
		test('Value for defined parameter passed to parameter', () => {
			var query = new Query();
			var calledWith = null;
			var param = new CallbackParam('a', { encode: (a) => { calledWith = a; return '1'; }});
			
			query.add(param);
			query.parseParameters({a: '123'});
			
			assert.equal('123', calledWith);
		});
		
		test('Returned value by parameter appended to result', () => {
			var query = new Query();
			var param = new CallbackParam('a', { encode: () => { return '123'; }});
			
			query.add(param);
			assert.deepEqual({'a': '123'}, query.parseParameters({a: '123'}));
		});
		
		test('Add multiple parameters', () => {
			var query = new Query();
			var param1 = new CallbackParam('a', { encode: () => { return '123'; }});
			var param2 = new Param('b');
			
			param2.setDefaultValue('hello world');
			param2.setIsAutoFillURL(true);
			
			query.add([param1, param2]);
			
			assert.deepEqual({'a': '123', 'b': 'hello world'}, query.parseParameters({a: '123'}));
		});
	});
});