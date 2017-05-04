'use strict';


const SeaRoute = require('../../../index');

const IntParam = SeaRoute.params.IntParam;

const assert = require('chai').assert;


suite('IntParam', () => {
	suite('validate', () => {
		test('not number', () => {
			assert.isFalse((new IntParam('a', -10, 10)).validate('nan'));
		});
		
		test('less then min', () => {
			assert.isFalse((new IntParam('a', -10, 10)).validate('-11'));
		});
		
		test('greater then max', () => {
			assert.isFalse((new IntParam('a', -10, 10)).validate('11'));
		});
		
		test('valid', () => {
			assert.isTrue((new IntParam('a', -10, 10)).validate('10'));
		});
		
		test('valid max and min int', () => {
			assert.isTrue((new IntParam('a')).validate(Number.MIN_VALUE.toString()));
			assert.isTrue((new IntParam('a')).validate(Number.MAX_VALUE.toString()));
		});
	});
	
	suite('encode', () => {
		test('number', () => {
			assert.strictEqual('123', (new IntParam('a')).encode(123));
		});
		
		test('number as string', () => {
			assert.strictEqual('123', (new IntParam('a')).encode('123'));
		});
		
		test('float', () => {
			assert.strictEqual('123', (new IntParam('a')).encode(123.4));
		});
		
		test('invalid string number', () => {
			try {
				(new IntParam('a')).encode('a');
			} catch (e) {
				return;
			}
			
			assert.fail();
		});
	});
	
	suite('extract', () => {
		test('number', () => {
			assert.strictEqual(123, (new IntParam('a')).extract('123'));
		});
	});
});