'use strict';


const SeaRoute = require('../../../index');

const IntParam = SeaRoute.ParamType.IntParam;

const assert = require('chai').assert;


suite('IntParam', () => 
{
	suite('validate', () => 
	{
		test('not number', () => 
		{
			assert.isFalse((new IntParam('a', -10, 10)).validate('nan'));
		});
		
		test('unexpected number format', () => 
		{
			assert.isFalse((new IntParam('a')).validate('0x10'));
		});
		
		test('less then min', () => 
		{
			assert.isFalse((new IntParam('a', -10, 10)).validate('-11'));
		});
		
		test('greater then max', () => 
		{
			assert.isFalse((new IntParam('a', -10, 10)).validate('11'));
		});
		
		test('valid', () => 
		{
			assert.isTrue((new IntParam('a', -10, 10)).validate('10'));
		});
		
		test('valid max and min int', () => 
		{
			assert.isTrue((new IntParam('a')).validate(Number.MIN_VALUE.toString()));
			assert.isTrue((new IntParam('a')).validate(Number.MAX_VALUE.toString()));
		});
	});
	
	suite('encode', () => 
	{
		test('number', () => 
		{
			assert.strictEqual('123', (new IntParam('a')).encode(123));
		});
		
		test('number as string', () => 
		{
			assert.strictEqual('123', (new IntParam('a')).encode('123'));
		});
		
		test('float', () => 
		{
			assert.strictEqual('123', (new IntParam('a')).encode(123.4));
		});
		
		test('invalid string number', () => 
		{
			assert.throws(() => 
		{
				(new IntParam('a')).encode('a');
			});
		});
	});
	
	suite('extract', () => 
	{
		test('number', () => 
		{
			assert.strictEqual(123, (new IntParam('a')).extract('123'));
		});
		
		test('floating number', () => 
		{
			assert.strictEqual(123, (new IntParam('a')).extract('123.3'));
		});
	});
	
	
	test('setMin', () => 
	{
		var subject = new IntParam('a', -10, 10);
		
		subject.setMin(-8);
		
		assert.isFalse(subject.validate('-9'));
		assert.isTrue(subject.validate('-8'));
	});
		
	test('setMax', () => 
	{
		var subject = new IntParam('a', -10, 10);
		
		subject.setMax(8);
		
		assert.isFalse(subject.validate('9'));
		assert.isTrue(subject.validate('8'));
	});
});