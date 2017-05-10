'use strict';


const SeaRoute = require('../../../index');

const Param = SeaRoute.params.Param;
const PredefinedParamDecorator = SeaRoute.params.PredefinedParamDecorator;

const assert = require('chai').assert;


suite('PredefinedParamDecorator', () => {
	test('methods cloned', () => {
		var param = new Param('a');
		var subject = new PredefinedParamDecorator('a', param);
		
		assert.strictEqual(param.extract,	subject.extract);
		assert.strictEqual(param.validate,	subject.validate);
		assert.strictEqual(param.encode,	subject.encode);
	});
	
	test('new name used', () => {
		var param = new Param('a');
		var subject = new PredefinedParamDecorator('b', param);
		
		assert.equal('b', subject.name());
	});
	
	test('original name not altered', () => {
		var param = new Param('a');
		var subject = new PredefinedParamDecorator('b', param);
		
		assert.equal('a', param.name());
	});
	
	test('flags cloned', () => {
		var paramTrue = new Param('a');
		var paramFalse = new Param('a');
		
		paramTrue.setDefaultValue(1);
		paramFalse.setDefaultValue(1);
		
		paramTrue.setIsOptional(true);
		paramTrue.setIsAutoFillURL(true);
		paramFalse.setIsOptional(false);
		paramFalse.setIsAutoFillURL(false);
		
		
		var subjectTrue = new PredefinedParamDecorator('b', paramTrue);
		var subjectFalse = new PredefinedParamDecorator('b', paramFalse);
		
		assert.isTrue(subjectTrue.isAutoFillURL());
		assert.isTrue(subjectTrue.isOptional());
		
		assert.isFalse(subjectFalse.isAutoFillURL());
		assert.isFalse(subjectFalse.isOptional());
	});
	
	test('default value cloned', () => {
		var param = new Param('a');
		
		param.setDefaultValue(123);
		
		var subject = new PredefinedParamDecorator('b', param);
		
		assert.equal(123, subject.defaultValue());
	});
});