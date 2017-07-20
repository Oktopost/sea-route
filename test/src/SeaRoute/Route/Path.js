'use strict';


const SeaRoute = require('../../../index');

const Path = SeaRoute.Route.Path;
const Part = SeaRoute.Route.Part;
const Param = SeaRoute.ParamType.Param;
const CallbackParam = SeaRoute.ParamType.CallbackParam;

const assert = require('chai').assert;


suite('Path', () =>
{
	test('text', () =>
	{
		var path = new Path('/a/b');
		assert.equal('/a/b', path.text());
	});
	
	test('parts/addPart', () =>
	{
		var path = new Path('/a/b');
		
		var part1 = new Part('a');
		var part2 = new Part('b');
		
		path.addPart(part1);
		path.addPart(part2);
		
		assert.deepEqual([part1, part2], path.parts());
	});
	
	test('partsCount', () =>
	{
		var path = new Path('/a/b');
		
		assert.equal(0, path.partsCount());
		
		path.addPart(new Part('a'));
		path.addPart(new Part('b'));
		
		assert.equal(2, path.partsCount());
	});
	
	
	suite('isMatching', () =>
	{
		test('Path to long, return false', () =>
		{
			var path = new Path('/a');
			
			path.addPart(new Part('a'));
			
			assert.isFalse(path.isMatching(['a', 'b']));
		});
		
		test('Path to short with required parts, return false', () =>
		{
			var path = new Path('/a/b');
		
			var part1 = new Part('a');
			var part2 = new Part('b');
			
			path.addPart(part1);
			path.addPart(part2);
			
			assert.isFalse(path.isMatching(['a']));
		});
		
		test('Path to short with optional parts, return true', () =>
		{
			var path = new Path('/a/b');
		
			var part1 = new Part('a');
			var part2 = new Part('b');
			var param2 = new Param('n');
			
			param2.setIsOptional(true);
			part2.setParam(param2);
			
			path.addPart(part1);
			path.addPart(part2);
			
			assert.isTrue(path.isMatching(['a']));
		});
		
		test('Path is const only and matching, return true', () =>
		{
			var path = new Path('/a/b');
		
			var part1 = new Part('a');
			var part2 = new Part('b');
			
			path.addPart(part1);
			path.addPart(part2);
			
			assert.isTrue(path.isMatching(['a', 'b']));
		});
		
		test('Path has params, params called', () =>
		{
			var path = new Path('/a/b/c');
		
			var calledWith1 = false;
			var calledWith3 = false;
			var part1 = new Part('a');
			var part2 = new Part('b');
			var part3 = new Part('c');
			
			var param1 = new CallbackParam('a', { validate: (a) => { calledWith1 = a; return true; }});
			var param3 = new CallbackParam('a', { validate: (a) => { calledWith3 = a; return true; }});
			
			path.addPart(part1.setParam(param1));
			path.addPart(part2);
			path.addPart(part3.setParam(param3));
			
			path.isMatching(['a', 'b', 'c']);
			
			assert.equal('a', calledWith1);
			assert.equal('c', calledWith3);
		});
	});
	
	suite('extract', () =>
	{
		test('const parts, return empty object', () =>
		{
			var path = new Path('/a/b');
			
			var part1 = new Part('a');
			var part2 = new Part('b');
			
			path.addPart(part1);
			path.addPart(part2);
			
			assert.deepEqual({}, path.extract(['a', 'b']));
		});
		
		test('Have params, object passed to parts', () =>
		{
			var path = new Path('/a/b');
		
			var calledWith1 = false;
			var part1 = new Part('a');
			var part2 = new Part('b');
			
			var param1 = new CallbackParam('a', { extract: (a) => { calledWith1 = a; return true; }});
			
			path.addPart(part1.setParam(param1));
			path.addPart(part2);
			
			path.extract(['a', 'b']);
			
			assert.equal('a', calledWith1);
		});
		
		test('Have params, object from params returned', () =>
		{
			var path = new Path('/a/{nn}');
			
			var part1 = new Part('a');
			var part2 = new Part('{nn}');
			
			var param1 = new CallbackParam('nn', { extract: () => { return 123; }});
			
			path.addPart(part1.setParam(param1));
			path.addPart(part2);
			
			assert.deepEqual({'nn': 123}, path.extract(['a', 'b']));
		});
		
		test('Missing optional parameter, parameter not present in result', () =>
		{
			var path = new Path('/a/{nn}');
			
			var part1 = new Part('a');
			var part2 = new Part('{nn}');
			
			var param2 = new Param('nn');
			param2.setIsOptional(true);
			
			path.addPart(part1);
			path.addPart(part2.setParam(param2));
			
			assert.deepEqual({}, path.extract(['a']));
		});
		
		test('Missing optional parameter, default value used', () =>
		{
			var path = new Path('/a/{nn}');
			
			var part1 = new Part('a');
			var part2 = new Part('{nn}');
			
			var param2 = new Param('nn');
			param2.setIsOptional(true);
			param2.setDefaultValue(123)
			
			path.addPart(part1);
			path.addPart(part2.setParam(param2));
			
			assert.deepEqual({ nn: 123 }, path.extract(['a']));
		});
	});
	
	suite('encode', () =>
	{
		test('No parts, return empty string', () =>
		{
			var path = new Path('/');
			assert.equal('/', path.encode({}));
		});
		
		test('Const parts, part values returned', () =>
		{
			var path = new Path('/a/b');
			
			var part1 = new Part('a');
			var part2 = new Part('b');
			
			path.addPart(part1);
			path.addPart(part2);
			
			assert.equal('/a/b', path.encode({}));
		});
		
		test('AutoFill part', () =>
		{
			var path = new Path('/a/b');
			
			var part1 = new Part('a');
			var part2 = new Part('b');
			
			var param2 = new Param('n');
			param2.setDefaultValue('abc');
			param2.setIsAutoFillURL(true);
			part2.setParam(param2);
			
			path.addPart(part1);
			path.addPart(part2);
			
			assert.equal('/a/abc', path.encode({}));
		});
		
		test('AutoFill part before const part', () =>
		{
			var path = new Path('/a/b');
			
			var part1 = new Part('a');
			var part2 = new Part('b');
			
			var param1 = new Param('n');
			param1.setDefaultValue('abc');
			param1.setIsAutoFillURL(true);
			part1.setParam(param1);
			
			path.addPart(part1);
			path.addPart(part2);
			
			assert.equal('/abc/b', path.encode({}));
		});
		
		test('Part with default value at end, part not appended', () =>
		{
			var path = new Path('/a/b');
			
			var part1 = new Part('a');
			var part2 = new Part('b');
			
			var param2 = new Param('n');
			param2.setDefaultValue('abc');
			param2.setIsAutoFillURL(false);
			part2.setParam(param2);
			
			path.addPart(part1);
			path.addPart(part2);
			
			assert.equal('/a', path.encode({}));
		});
		
		test('Part with default value before const parts, part appended', () =>
		{
			var path = new Path('/a/b');
			
			var part1 = new Part('a');
			var part2 = new Part('b');
			
			var param1 = new Param('n');
			param1.setDefaultValue('abc');
			param1.setIsAutoFillURL(false);
			part1.setParam(param1);
			
			path.addPart(part1);
			path.addPart(part2);
			
			assert.equal('/abc/b', path.encode({}));
		});
		
		test('Sequel of Parts with default values at end, part not appended', () =>
		{
			var path = new Path('/a/b');
			
			var part1 = new Part('a');
			var part2 = new Part('b');
			var part3 = new Part('c');
			
			var param2 = new Param('n');
			param2.setDefaultValue('abc');
			param2.setIsAutoFillURL(false);
			part2.setParam(param2);
			
			var param3 = new Param('n');
			param3.setDefaultValue('efg');
			param3.setIsAutoFillURL(false);
			part3.setParam(param3);
			
			path.addPart(part1);
			path.addPart(part2);
			path.addPart(part3);
			
			assert.equal('/a', path.encode({}));
		});
		
		test('Optional Part at end, part not appended', () =>
		{
			var path = new Path('/a/b');
			
			var part1 = new Part('a');
			var part2 = new Part('b');
			
			var param2 = new Param('n');
			param2.setIsAutoFillURL(false);
			param2.setIsOptional(true);
			part2.setParam(param2);
			
			path.addPart(part1);
			path.addPart(part2);
			
			assert.equal('/a', path.encode({}));
		});
		
		test('Optional Part at middle, error thrown', () =>
		{
			var path = new Path('/a/b');
			
			var part1 = new Part('a');
			var part2 = new Part('b');
			
			var param1 = new Param('n');
			param1.setIsAutoFillURL(false);
			param1.setIsOptional(true);
			part1.setParam(param1);
			
			path.addPart(part1);
			path.addPart(part2);
			
			assert.throws(() => {
				path.encode({});
			});
		});
		
		test('Optional Part at middle, error thrown', () =>
		{
			var path = new Path('/a/b');
			
			var part1 = new Part('a');
			var part2 = new Part('b');
			
			var param1 = new Param('n');
			param1.setIsAutoFillURL(false);
			param1.setIsOptional(true);
			part1.setParam(param1);
			
			path.addPart(part1);
			path.addPart(part2);
			
			assert.throws(() => {
				path.encode({});
			});
		});
		
		test('Required param not passed, error thrown', () =>
		{
			var path = new Path('/a/b');
			
			var part1 = new Part('a');
			var part2 = new Part('b');
			
			var param2 = new Param('n');
			param2.setIsOptional(false);
			part2.setParam(param2);
			
			path.addPart(part1);
			path.addPart(part2);
			
			assert.throws(() => {
				path.encode({});
			});
		});
		
		test('Values for parameter passed', () =>
		{
			var path = new Path('/a/b');
			var calledWith = false;
			
			var part1 = new Part('a');
			var part2 = new Part('b');
			
			var param2 = new CallbackParam('n', { encode: (a) => { calledWith = a; return '123'; } });
			part2.setParam(param2);
			
			path.addPart(part1);
			path.addPart(part2);
			
			assert.equal('/a/123', path.encode({n: 'abc'}));
			assert.equal('abc', calledWith);
		});
		
		test('Values for parameter passed after optional parameter', () =>
		{
			var path = new Path('/a/b');
			var calledWith = false;
			
			var part1 = new Part('a');
			var part2 = new Part('b');
			var part3 = new Part('c');
			
			var param2 = new Param('f');
			param2.setDefaultValue('555');
			param2.setIsOptional(true);
			param2.setIsAutoFillURL(false);
			part2.setParam(param2);
			
			var param3 = new CallbackParam('n', { encode: (a) => { calledWith = a; return '123'; } });
			part3.setParam(param3);
			
			path.addPart(part1);
			path.addPart(part2);
			path.addPart(part3);
			
			assert.equal('/a/555/123', path.encode({n: 'abc'}));
		});
		
		test('Value is escaped', () =>
		{
			var path = new Path('/a/b');
			
			var part1 = new Part('a');
			var part2 = new Part('b');
			
			var param2 = new CallbackParam('n', { encode: () => { return 'a b'; } });
			part2.setParam(param2);
			
			path.addPart(part1);
			path.addPart(part2);
			
			assert.equal('/a/a%20b', path.encode({n: 'a'}));
		});
		
		test('Const value is encoded', () =>
		{
			var path = new Path('/a/b');
			
			var part1 = new Part('a');
			var part2 = new Part('b');
			var part3 = new Part('c');
			
			var param2 = new Param('n');
			param2.setDefaultValue('a b');
			param2.setIsOptional(true);
			param2.setIsAutoFillURL(false);
			part2.setParam(param2);
			
			path.addPart(part1);
			path.addPart(part2);
			path.addPart(part3);
			
			assert.equal('/a/a%20b/c', path.encode({}));
		});
	});
	
	suite('paramNames', () =>
	{
		test('Empty path, return empty array', () => 
		{
			var path = new Path('');
			assert.deepEqual([], path.paramNames());
		});
		
		test('Const only path, return empty array', () => 
		{
			var path = new Path('/a/b');
			
			var part1 = new Part('a');
			var part2 = new Part('b');
			
			path.addPart(part1);
			path.addPart(part2);
			
			assert.deepEqual([], path.paramNames());
		});
		
		test('One parameter, parameter name returned', () => 
		{
			var path = new Path('/n');
			
			var part1 = new Part('a');
			part1.setParam(new Param('pname'));
			
			path.addPart(part1);
			
			assert.deepEqual(['pname'], path.paramNames());
		});
		
		test('Have number of params', () => 
		{
			var path = new Path('/a/b');
			
			var part1 = new Part('a');
			part1.setParam(new Param('pname'));
			
			var part2 = new Part('b');
			part2.setParam(new Param('p2name'));
			
			path.addPart(part1);
			path.addPart(part2);
			
			assert.deepEqual(['pname', 'p2name'], path.paramNames());
		});
		
		test('Have mixed params and const parts', () => 
		{
			var path = new Path('/a/b/c');
			
			var part1 = new Part('a');
			part1.setParam(new Param('pname'));
			
			var part2 = new Part('b');
			
			var part3 = new Part('c');
			part3.setParam(new Param('p3name'));
			
			path.addPart(part1);
			path.addPart(part2);
			path.addPart(part3);
			
			assert.deepEqual(['pname', 'p3name'], path.paramNames());
		});
	});
});