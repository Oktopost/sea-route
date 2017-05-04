'use strict';


const SeaRoute = require('../../../index');

const Path = SeaRoute.route.Path;
const Part = SeaRoute.route.Part;
const Param = SeaRoute.params.Param;
const CallbackParam = SeaRoute.params.CallbackParam;

const assert = require('chai').assert;


suite('Path', () => {
	test('text', () => {
		let path = new Path('/a/b');
		assert.equal('/a/b', path.text());
	});
	
	test('parts/addPart', () => {
		let path = new Path('/a/b');
		
		let part1 = new Part('a');
		let part2 = new Part('b');
		
		path.addPart(part1);
		path.addPart(part2);
		
		assert.deepEqual([part1, part2], path.parts());
	});
	
	test('partsCount', () => {
		let path = new Path('/a/b');
		
		assert.equal(0, path.partsCount());
		
		path.addPart(new Part('a'));
		path.addPart(new Part('b'));
		
		assert.equal(2, path.partsCount());
	});
	
	
	suite('isMatching', () => {
		test('Path to long, return false', () => {
			let path = new Path('/a');
			
			path.addPart(new Part('a'));
			
			assert.isFalse(path.isMatching(['a', 'b']));
		});
		
		test('Path to short with required parts, return false', () => {
			let path = new Path('/a/b');
		
			let part1 = new Part('a');
			let part2 = new Part('b');
			
			path.addPart(part1);
			path.addPart(part2);
			
			assert.isFalse(path.isMatching(['a']));
		});
		
		test('Path to short with optional parts, return true', () => {
			let path = new Path('/a/b');
		
			let part1 = new Part('a');
			let part2 = new Part('b');
			let param2 = new Param('n');
			
			param2.setIsOptional(true);
			part2.setParam(param2);
			
			path.addPart(part1);
			path.addPart(part2);
			
			assert.isTrue(path.isMatching(['a']));
		});
		
		test('Path is const only and matching, return true', () => {
			let path = new Path('/a/b');
		
			let part1 = new Part('a');
			let part2 = new Part('b');
			
			path.addPart(part1);
			path.addPart(part2);
			
			assert.isTrue(path.isMatching(['a', 'b']));
		});
		
		test('Path has params, params called', () => {
			let path = new Path('/a/b/c');
		
			let calledWith1 = false;
			let calledWith3 = false;
			let part1 = new Part('a');
			let part2 = new Part('b');
			let part3 = new Part('c');
			
			let param1 = new CallbackParam('a', { validate: (a) => { calledWith1 = a; return true; }});
			let param3 = new CallbackParam('a', { validate: (a) => { calledWith3 = a; return true; }});
			
			path.addPart(part1.setParam(param1));
			path.addPart(part2);
			path.addPart(part3.setParam(param3));
			
			path.isMatching(['a', 'b', 'c']);
			
			assert.equal('a', calledWith1);
			assert.equal('c', calledWith3);
		});
	});
	
	suite('extract', () => {
		test('const parts, return empty object', () => {
			let path = new Path('/a/b');
			
			let part1 = new Part('a');
			let part2 = new Part('b');
			
			path.addPart(part1);
			path.addPart(part2);
			
			assert.deepEqual({}, path.extract(['a', 'b']));
		});
		
		test('Have params, object passed to parts', () => {
			let path = new Path('/a/b');
		
			let calledWith1 = false;
			let part1 = new Part('a');
			let part2 = new Part('b');
			
			let param1 = new CallbackParam('a', { extract: (a) => { calledWith1 = a; return true; }});
			
			path.addPart(part1.setParam(param1));
			path.addPart(part2);
			
			path.extract(['a', 'b']);
			
			assert.equal('a', calledWith1);
		});
		
		test('Have params, object from params returned', () => {
			let path = new Path('/a/{nn}');
			
			let part1 = new Part('a');
			let part2 = new Part('{nn}');
			
			let param1 = new CallbackParam('nn', { extract: () => { return 123; }});
			
			path.addPart(part1.setParam(param1));
			path.addPart(part2);
			
			assert.deepEqual({'nn': 123}, path.extract(['a', 'b']));
		});
	});
	
	suite('encode', () => {
		test('No parts, return empty string', () => {
			let path = new Path('/');
			assert.equal('/', path.encode({}));
		});
		
		test('Const parts, part values returned', () => {
			let path = new Path('/a/b');
			
			let part1 = new Part('a');
			let part2 = new Part('b');
			
			path.addPart(part1);
			path.addPart(part2);
			
			assert.equal('/a/b', path.encode({}));
		});
		
		test('AutoFill part', () => {
			let path = new Path('/a/b');
			
			let part1 = new Part('a');
			let part2 = new Part('b');
			
			let param2 = new Param('n');
			param2.setDefaultValue('abc');
			param2.setIsAutoFillURL(true);
			part2.setParam(param2);
			
			path.addPart(part1);
			path.addPart(part2);
			
			assert.equal('/a/abc', path.encode({}));
		});
		
		test('AutoFill part before const part', () => {
			let path = new Path('/a/b');
			
			let part1 = new Part('a');
			let part2 = new Part('b');
			
			let param1 = new Param('n');
			param1.setDefaultValue('abc');
			param1.setIsAutoFillURL(true);
			part1.setParam(param1);
			
			path.addPart(part1);
			path.addPart(part2);
			
			assert.equal('/abc/b', path.encode({}));
		});
		
		test('Part with default value at end, part not appended', () => {
			let path = new Path('/a/b');
			
			let part1 = new Part('a');
			let part2 = new Part('b');
			
			let param2 = new Param('n');
			param2.setDefaultValue('abc');
			param2.setIsAutoFillURL(false);
			part2.setParam(param2);
			
			path.addPart(part1);
			path.addPart(part2);
			
			assert.equal('/a', path.encode({}));
		});
		
		test('Part with default value before const parts, part appended', () => {
			let path = new Path('/a/b');
			
			let part1 = new Part('a');
			let part2 = new Part('b');
			
			let param1 = new Param('n');
			param1.setDefaultValue('abc');
			param1.setIsAutoFillURL(false);
			part1.setParam(param1);
			
			path.addPart(part1);
			path.addPart(part2);
			
			assert.equal('/abc/b', path.encode({}));
		});
		
		test('Sequel of Parts with default values at end, part not appended', () => {
			let path = new Path('/a/b');
			
			let part1 = new Part('a');
			let part2 = new Part('b');
			let part3 = new Part('c');
			
			let param2 = new Param('n');
			param2.setDefaultValue('abc');
			param2.setIsAutoFillURL(false);
			part2.setParam(param2);
			
			let param3 = new Param('n');
			param3.setDefaultValue('efg');
			param3.setIsAutoFillURL(false);
			part3.setParam(param3);
			
			path.addPart(part1);
			path.addPart(part2);
			path.addPart(part3);
			
			assert.equal('/a', path.encode({}));
		});
		
		test('Optional Part at end, part not appended', () => {
			let path = new Path('/a/b');
			
			let part1 = new Part('a');
			let part2 = new Part('b');
			
			let param2 = new Param('n');
			param2.setIsAutoFillURL(false);
			param2.setIsOptional(true);
			part2.setParam(param2);
			
			path.addPart(part1);
			path.addPart(part2);
			
			assert.equal('/a', path.encode({}));
		});
		
		test('Optional Part at middle, error thrown', () => {
			let path = new Path('/a/b');
			
			let part1 = new Part('a');
			let part2 = new Part('b');
			
			let param1 = new Param('n');
			param1.setIsAutoFillURL(false);
			param1.setIsOptional(true);
			part1.setParam(param1);
			
			path.addPart(part1);
			path.addPart(part2);
			
			assert.throws(() => {
				path.encode({});
			});
		});
		
		test('Optional Part at middle, error thrown', () => {
			let path = new Path('/a/b');
			
			let part1 = new Part('a');
			let part2 = new Part('b');
			
			let param1 = new Param('n');
			param1.setIsAutoFillURL(false);
			param1.setIsOptional(true);
			part1.setParam(param1);
			
			path.addPart(part1);
			path.addPart(part2);
			
			assert.throws(() => {
				path.encode({});
			});
		});
		
		test('Required param not passed, error thrown', () => {
			let path = new Path('/a/b');
			
			let part1 = new Part('a');
			let part2 = new Part('b');
			
			let param2 = new Param('n');
			param2.setIsOptional(false);
			part2.setParam(param2);
			
			path.addPart(part1);
			path.addPart(part2);
			
			assert.throws(() => {
				path.encode({});
			});
		});
		
		test('Values for parameter passed', () => {
			let path = new Path('/a/b');
			let calledWith = false;
			
			let part1 = new Part('a');
			let part2 = new Part('b');
			
			let param2 = new CallbackParam('n', { encode: (a) => { calledWith = a; return '123'; } });
			part2.setParam(param2);
			
			path.addPart(part1);
			path.addPart(part2);
			
			assert.equal('/a/123', path.encode({n: 'abc'}));
			assert.equal('abc', calledWith);
		});
		
		test('Values for parameter passed after optional parameter', () => {
			let path = new Path('/a/b');
			let calledWith = false;
			
			let part1 = new Part('a');
			let part2 = new Part('b');
			let part3 = new Part('c');
			
			let param2 = new Param('f');
			param2.setDefaultValue('555');
			param2.setIsOptional(true);
			param2.setIsAutoFillURL(false);
			part2.setParam(param2);
			
			let param3 = new CallbackParam('n', { encode: (a) => { calledWith = a; return '123'; } });
			part3.setParam(param3);
			
			path.addPart(part1);
			path.addPart(part2);
			path.addPart(part3);
			
			assert.equal('/a/555/123', path.encode({n: 'abc'}));
		});
		
		test('Value is escaped', () => {
			let path = new Path('/a/b');
			
			let part1 = new Part('a');
			let part2 = new Part('b');
			
			let param2 = new CallbackParam('n', { encode: () => { return 'a b'; } });
			part2.setParam(param2);
			
			path.addPart(part1);
			path.addPart(part2);
			
			assert.equal('/a/a%20b', path.encode({n: 'a'}));
		});
		
		test('Const value is encoded', () => {
			let path = new Path('/a/b');
			
			let part1 = new Part('a');
			let part2 = new Part('b');
			let part3 = new Part('c');
			
			let param2 = new Param('n');
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
});