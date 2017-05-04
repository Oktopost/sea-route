'use strict';


const SeaRoute = require('../../../index');

const Param = SeaRoute.params.Param;

const assert = require('chai').assert;


suite('Param', () => {
	test('name', () => {
		assert.equal('ab', (new Param('ab')).name());
	});
	
	test('defaultValue', () => {
		var param = new Param('ab');
		param.setDefaultValue(123);
		assert.equal(123, param.defaultValue());
	});
	
	test('defaultValue for not optional', () => {
		var param = new Param('ab');
		param.setDefaultValue(123);
		param.setIsOptional(false);
		assert.isUndefined(param.defaultValue());
	});
	
	test('setDefaultValue updates isOptional', () => {
		var param = new Param('ab');
		param.setDefaultValue(123);
		assert.isTrue(param.isOptional());
	});
	
	test('hasDefaultValue', () => {
		var param1 = new Param('ab');
		param1.setDefaultValue(123);
		assert.isTrue(param1.hasDefaultValue());
		
		var param2 = new Param('ab');
		param2.setDefaultValue('');
		assert.isTrue(param2.hasDefaultValue());
		
		var param3 = new Param('ab');
		param3.setDefaultValue('');
		param3.setIsOptional(false);
		assert.isFalse(param3.hasDefaultValue());
		
		var param4 = new Param('ab');
		assert.isFalse(param4.hasDefaultValue());
	});
	
	test('isOptional', () => {
		var param1 = new Param('ab');
		
		assert.isFalse(param1.isOptional());
		
		param1.setIsOptional(true);
		assert.isTrue(param1.isOptional());
	});
	
	test('isAutoFillURL', () => {
		var param1 = new Param('ab');
		assert.isFalse(param1.isAutoFillURL());
		
		var param2 = new Param('ab');
		param2.setDefaultValue('');
		assert.isFalse(param2.isAutoFillURL());
		
		var param3 = new Param('ab');
		param3.setDefaultValue('');
		param3.setIsAutoFillURL(true);
		assert.isTrue(param3.isAutoFillURL());
		
		var param4 = new Param('ab');
		param3.setDefaultValue('');
		param3.setIsAutoFillURL(true);
		param3.setIsOptional(false);
		assert.isFalse(param4.isAutoFillURL());
	});
	
	test('validate', () => {
		var param1 = new Param('ab');
		assert.isTrue(param1.validate());
	});
	
	test('encode', () => {
		var param1 = new Param('ab');
		assert.strictEqual('123', param1.encode(123));
	});
	
	test('extract', () => {
		var param1 = new Param('ab');
		assert.strictEqual('123', param1.extract('123'));
	});
});