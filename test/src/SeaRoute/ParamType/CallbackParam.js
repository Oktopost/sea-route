'use strict';


const SeaRoute = require('../../../index');

const CallbackParam = SeaRoute.ParamType.CallbackParam;

const assert = require('chai').assert;


suite('CallbackParam', () => {
	test('validate', () => {
		var calledWith = null;
		var result = (
			new CallbackParam(
				'a', 
				{ validate: (a) => { calledWith = a; return '123'; }}))
			.validate('a');
		
		assert.equal('a', calledWith);
		assert.equal('123', result);
	});
	
	test('encode', () => {
		var calledWith = null;
		var result = (
			new CallbackParam(
				'a', 
				{ encode: (a) => { calledWith = a; return '123'; }}))
			.encode('a');
		
		assert.equal('a', calledWith);
		assert.equal('123', result);
	});
	
	test('extract', () => {
		var calledWith = null;
		var result = (
			new CallbackParam(
				'a', 
				{ extract: (a) => { calledWith = a; return '123'; }}))
			.extract('a');
		
		assert.equal('a', calledWith);
		assert.equal('123', result);
	});
});