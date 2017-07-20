'use strict';


const SeaRoute = require('../../../index');

const NumberParam = SeaRoute.ParamType.NumberParam;

const assert = require('chai').assert;


suite('NumberParam', () => 
{
	suite('validate', () => 
	{
		test('not number', () => 
		{
			assert.isFalse((new NumberParam('a', -10, 10)).validate('nan'));
		});
		
		test('unexpected number format', () => 
		{
			assert.isFalse((new NumberParam('a')).validate('0x10'));
		});
		
		test('less then min', () => 
		{
			assert.isFalse((new NumberParam('a', -10, 10)).validate('-10.1'));
		});
		
		test('greater then max', () => 
		{
			assert.isFalse((new NumberParam('a', -10, 10)).validate('10.1'));
		});
		
		test('valid', () => 
		{
			assert.isTrue((new NumberParam('a', -10, 10)).validate('9.9'));
		});
		
		test('valid max and min int', () => 
		{
			assert.isTrue((new NumberParam('a')).validate(Number.MIN_VALUE.toString()));
			assert.isTrue((new NumberParam('a')).validate(Number.MAX_VALUE.toString()));
		});
	});
	
	suite('encode', () => 
	{
		test('number', () => 
		{
			assert.strictEqual('123', (new NumberParam('a')).encode(123));
		});
		
		test('number as string', () => 
		{
			assert.strictEqual('123', (new NumberParam('a')).encode('123'));
		});
		
		test('float', () => 
		{
			assert.strictEqual('123.4', (new NumberParam('a')).encode(123.4));
		});
		
		test('float as string', () => 
		{
			assert.strictEqual('123.23', (new NumberParam('a')).encode('123.23'));
		});
		
		test('negative', () => 
		{
			assert.strictEqual('-10.1', (new NumberParam('a')).encode(-10.10));
		});
		
		test('invalid string number', () => 
		{
			assert.throws(() => 
		{
				(new NumberParam('a')).encode('a');
			});
		});
	});
	
	suite('extract', () => 
	{
		test('number', () => 
		{
			assert.strictEqual(123, (new NumberParam('a')).extract('123'));
		});
		
		test('floating number', () => 
		{
			assert.strictEqual(123.3, (new NumberParam('a')).extract('123.3'));
		});
	});
	
	
	test('setMin', () => 
	{
		var subject = new NumberParam('a', -10, 10);
		
		subject.setMin(-8);
		
		assert.isFalse(subject.validate('-8.1'));
		assert.isTrue(subject.validate('-7.9'));
	});
		
	test('setMax', () => 
	{
		var subject = new NumberParam('a', -10, 10);
		
		subject.setMax(8);
		
		assert.isFalse(subject.validate('8.1'));
		assert.isTrue(subject.validate('7.9'));
	});
});