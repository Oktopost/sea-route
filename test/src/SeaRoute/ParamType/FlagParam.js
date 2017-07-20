const SeaRoute = require('../../../index');

const FlagParam = SeaRoute.ParamType.FlagParam;

const assert = require('chai').assert;


suite('FlagParam', () => 
{
	test('isOptional', () =>
	{
		var subject = new FlagParam('abc');
		
		assert.isTrue(subject.isOptional());
		subject.setIsOptional(false);
		assert.isTrue(subject.isOptional());
	});
	
	test('hasDefaultValue', () =>
	{
		var subject = new FlagParam('abc');
		assert.isTrue(subject.hasDefaultValue());
	});
	
	test('extract', () =>
	{
		var subject = new FlagParam('abc');
		assert.isTrue(subject.extract());
	});
	
	test('encode', () =>
	{
		var subject = new FlagParam('abc');
		assert.equal('abc', subject.encode('nnn'));
	});
	
	test('defaultValue', () =>
	{
		var subject = new FlagParam('abc');
		assert.isFalse(subject.defaultValue());
	});
	
	test('validate', () =>
	{
		var subject = new FlagParam('abc');
		assert.isFalse(subject.validate('abd'));
		assert.isTrue(subject.validate('abc'));
	});
});