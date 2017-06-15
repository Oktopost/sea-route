'use strict';


const SeaRoute = require('../../../index');

const Part = SeaRoute.Route.Part;
const Param = SeaRoute.ParamType.Param;
const CallbackParam = SeaRoute.ParamType.CallbackParam;

const assert = require('chai').assert;


suite('Part', () => {
	test('text', () => {
		assert.equal('abc', (new Part('abc')).text());
	});
	
	test('param', () => {
		let part = new Part('');
		let param = new Param('a');
		
		part.setParam(param);
		
		assert.equal(param, part.getParam());
	});
	
	test('getParamName', () => {
		let part = new Part('');
		part.setParam(new Param('a'));
		
		assert.equal('a', part.getParamName());
	});
	
	
	suite('isOptional', () => {
		test('const part, return false', () => {
			let part = new Part('');
			assert.isFalse(part.isOptional());
		});
		
		test('has param', () => {
			let part = new Part('');
			let param = new Param('a');
			
			part.setParam(param);
			
			assert.isFalse(part.isOptional());
			param.setDefaultValue('');
			
			assert.isTrue(part.isOptional());
		});
	});
	
	suite('isConst', () => {
		test('Has param, returns false', () => {
			let part = new Part('');
			part.setParam(new Param('a'));
			
			assert.isFalse(part.isConst());
		});
		
		test('No param, returns true', () => {
			let part = new Part('');
			assert.isTrue(part.isConst());
		});
	});
	
	suite('validate', () => {
		test('part is const, text matches, return true', () => {
			assert.isTrue((new Part('abc')).validate('abc'));
		});
		
		test('part is const, text doesn\'t matches, return false', () => {
			assert.isFalse((new Part('abd')).validate('abc'));
		});
		
		test('Part has param, Param validation called', () => {
			let part = new Part('');
			let calledWith = false;
			
			part.setParam(new CallbackParam('a', {
				validate: function (a) { calledWith = a; },
			}));
			
			part.validate('abc');
			
			assert.equal('abc', calledWith);
		});
		
		test('Part has param, Param return true, return tue', () => {
			let part = new Part('');
			let isCalled = false;
			
			part.setParam(new CallbackParam('a', { validate: () => true }));
			
			assert.isTrue(part.validate('abc'));
		});
		
		test('Part has param, Param return false, return false', () => {
			let part = new Part('');
			
			part.setParam(new CallbackParam('a', { validate: () => false }));
			
			assert.isFalse(part.validate('abc'));
		});
	});
	
	suite('encode', () => {
		test('part is const, return text', () => {
			assert.equal('abc', (new Part('abc')).encode(123));
		});
		
		test('Part has param, Param encode called', () => {
			let part = new Part('');
			let calledWith = false;
			
			part.setParam(new CallbackParam('a', {
				encode: function (a) { calledWith = a; },
			}));
			
			part.encode(123);
			
			assert.equal(123, calledWith);
		});
		
		test('Part has param, Param value returned', () => {
			let part = new Part('');
			
			part.setParam(new CallbackParam('a', { encode: () => 321 }));
			
			assert.equal(321, part.encode('abc'));
		});
	});
	
	suite('extract', () => {
		test('part is const, object not modified', () => {
			var obj = {};
			(new Part('abc')).extract('123');
			assert.deepEqual({}, obj);
		});
		
		test('Part has param, Extract for param called', () => {
			let part = new Part('');
			let calledWith = false;
			
			part.setParam(new CallbackParam('a', {
				extract: function (a) { calledWith = a; },
			}));
			
			part.extract('123', {});
			
			assert.equal('123', calledWith);
		});
		
		test('Part has param, Param Value appended', () => {
			var obj = {a: 1};
			let part = new Part('');
			
			part.setParam(new CallbackParam('b', { extract: () => 321 }));
			part.extract('a', obj);
			
			assert.deepEqual({a: 1, b: 321}, obj);
		});
	});
});