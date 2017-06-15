'use strict';


const SeaRoute = require('../../index');


const is = namespace().Plankton.is;
const obj = namespace().Plankton.obj;

const Params	= SeaRoute.Params;
const Param		= SeaRoute.ParamType.Param;

const assert = require('chai').assert;


suite('Params', () =>
{
	test('(Map) - Mapped parameters returned', () =>
	{
		var data = {
			a: {
				name: 'b',
				value: 'c'
			},
			b: /abc/
		};
		
		var result = Params.create(data);
		
		assert.equal(2, obj.count(result));
		assert.instanceOf(result.a, Param);
		assert.instanceOf(result.b, Param);
	});
	
	test('(Map) - Key used as name', () => {
		var data = {
			name: {
				value: /abc/
			}
		};
		
		var result = Params.create(data);
		
		assert.equal('name', result.name.name());
	});
	
	test('(Map) - Name parameter used as name', () => {
		var data = {
			notName: {
				name: 'this',
				value: /abc/
			}
		};
		
		var result = Params.create(data);
		
		assert.equal('this', result.notName.name());
	});
});