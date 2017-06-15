'use strict';


const SeaRoute = require('../../../index');

const OneOfParam = SeaRoute.ParamType.OneOfParam;
const assert = require('chai').assert;


suite('OneOfParam', () => {
	suite('validate', () => {
		test('not in array', () => {
			assert.isFalse((new OneOfParam('a', ['a', 'b'])).validate('c'));
		});
		
		test('in array', () => {
			assert.isTrue((new OneOfParam('a', ['a', 'b'])).validate('b'));
		});
	});
	
	suite('extract', () => {
		test('value in array', () => {
			assert.deepEqual('a', (new OneOfParam('a', ['a'])).extract('a'));
		});
		
		test('value not in array, error thrown', () => {
			assert.throws(() => {
				(new OneOfParam('a', ['a'])).extract('b');
			});
		});
		
		test('undefined treated as empty string', () => {
			assert.deepEqual('', (new OneOfParam('a', [''])).extract(undefined));
		});
	});
	
	test('encode', () => {
		assert.equal('a', (new OneOfParam('a', [])).encode('a'));
	});
});