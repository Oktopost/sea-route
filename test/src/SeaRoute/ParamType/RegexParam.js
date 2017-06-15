'use strict';


const SeaRoute = require('../../../index');

const RegexParam = SeaRoute.ParamType.RegexParam;

const assert = require('chai').assert;


suite('RegexParam', () => {
	suite('validate', () => {
		test('matching', () => {
			assert.isTrue((new RegexParam('a', /^a$/)).validate('a'));
		});
		
		test('not matching', () => {
			assert.isFalse((new RegexParam('a', /^a$/)).validate('b'));
		});
	});
	
	suite('encode', () => {
		test('matching value', () => {
			assert.strictEqual('a', (new RegexParam('a', /^a$/)).encode('a'));
		});
		
		test('matching value that is not string', () => {
			assert.strictEqual('1', (new RegexParam('a', /^1$/)).encode(1));
		});
		
		test('invalid string', () => {
			assert.throws(() => {
				(new RegexParam('a', /^1$/)).encode('a');
			});
		});
	});
	
	suite('extract', () => {
		test('same value', () => {
			assert.strictEqual('123', (new RegexParam('a', /^1$/)).extract('123'));
		});
	});
});