'use strict';


const SeaRoute = require('../../../index');

const WildcardParam = SeaRoute.params.WildcardParam;

const assert = require('chai').assert;


suite('WildcardParam', () => {
	test('const string', () => {
		assert.isTrue((new WildcardParam('a', 'b')).validate('b'));
		assert.isFalse((new WildcardParam('a', 'b')).validate('abc'));
	});
	
	test('expression', () => {
		assert.isTrue((new WildcardParam('a', 'b*c')).validate('b123c'));
		assert.isFalse((new WildcardParam('a', 'b*c')).validate('b123d'));
	});
});