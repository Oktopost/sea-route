'use strict';


const SeaRoute = require('../../../index');

const JsonParam = SeaRoute.params.JsonParam;
const assert = require('chai').assert;


suite('JsonParam', () => {
	suite('validate', () => {
		test('not json', () => {
			assert.isFalse((new JsonParam('a')).validate('notjson'));
		});
		
		test('json', () => {
			assert.isTrue((new JsonParam('a', -10, 10)).validate('{"a":2}'));
		});
	});
	
	test('encode', () => {
		assert.equal('{"a":1}', (new JsonParam('a')).encode({ a : 1 }));
	});
	
	test('extract', () => {
		assert.deepEqual({a: 1}, (new JsonParam('a')).extract('{"a":1}'));
	});
});