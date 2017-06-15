'use strict';


const SeaRoute = require('../../../index');


const Param						= SeaRoute.ParamType.Param;
const IntParam					= SeaRoute.ParamType.IntParam;
const JsonParam					= SeaRoute.ParamType.JsonParam;
const RegexParam				= SeaRoute.ParamType.RegexParam;
const OneOfParam				= SeaRoute.ParamType.OneOfParam;
const WildcardParam				= SeaRoute.ParamType.WildcardParam;
const PredefinedParamDecorator	= SeaRoute.ParamType.PredefinedParamDecorator;

const ParamParser = SeaRoute.Parsers.ParamParser;

const assert = require('chai').assert;


suite('ParamParser', () => {
	suite('Default data', () => {
		test('return generic param', () => {
			assert.instanceOf(ParamParser.parse('a', {}), Param);
		});
		
		test('default flags', () => {
			var obj = ParamParser.parse('a', {});
			
			assert.isFalse(obj.hasDefaultValue());
			assert.isFalse(obj.isAutoFillURL());
			assert.isFalse(obj.isOptional());
		});
		
		test('name passed', () => {
			var obj = ParamParser.parse('a', {});
			assert.equal('a', obj.name());
		});
	});
	
	
	suite('flags', () => {
		suite('optional', () => {
			test('true', () => {
				var obj = ParamParser.parse('a', { optional: true });
				assert.isTrue(obj.isOptional());
			});
			
			test('false', () => {
				var obj = ParamParser.parse('a', { optional: false });
				assert.isFalse(obj.isOptional());
			});
		});
		
		suite('auto fill', () => {
			test('true', () => {
				var obj = ParamParser.parse('a', { def: 1, fill: true });
				assert.isTrue(obj.isAutoFillURL());
			});
			
			test('false', () => {
				var obj = ParamParser.parse('a', { def: 1, fill: false });
				assert.isFalse(obj.isAutoFillURL());
			});
			
			test('no default value, error thrown', () => {
				assert.throws(() => { ParamParser.parse('a', { fill: false }) });
			});
		});
		
		test('default value used', () => {
			var obj = ParamParser.parse('a', { def: 123 });
			assert.isTrue(obj.hasDefaultValue());
			assert.equal(123, obj.defaultValue());
		});
	});
	
	
	suite('non config object', () => {
		test('array', () => {
			var obj = ParamParser.parse('a', ['a', 'b']);
			
			assert.instanceOf(obj, OneOfParam);
			assert.isTrue(obj.validate('a'));
			assert.isFalse(obj.validate('c'));
		});
		
		test('RegExp', () => {
			var obj = ParamParser.parse('a', /a/i);
			
			assert.instanceOf(obj, RegexParam);
			assert.isTrue(obj.validate('a'));
			assert.isTrue(obj.validate('A'));
			assert.isFalse(obj.validate('b'));
		});
		
		test('string', () => {
			var obj = ParamParser.parse('a', 'a*b');
			
			assert.instanceOf(obj, RegexParam);
			assert.isTrue(obj.validate('ab'));
			assert.isTrue(obj.validate('annnb'));
			
			assert.isFalse(obj.validate('ac'));
		});
		
		test('Param', () => {
			var prm = new Param('n');
			var obj = ParamParser.parse('a', prm);
			
			assert.instanceOf(obj, PredefinedParamDecorator);
			assert.equal('a', obj.name());
		});
		
		test('invalid', () => {
			assert.throws(() => { ParamParser.parse('a', true) });
		});
		
		test('value flag used', () => {
			var obj = ParamParser.parse('a', { value: ['a', 'b'] });
			assert.instanceOf(obj, OneOfParam);
		});
	});
	
	suite('create by type', () => {
		test('int', () => {
			var obj = ParamParser.parse('a', { type: 'int' });
			assert.instanceOf(obj, IntParam);
		});
		
		test('array', () => {
			var obj = ParamParser.parse('a', { type: 'array', values: [] });
			assert.instanceOf(obj, OneOfParam);
		});
		
		test('regex', () => {
			var obj = ParamParser.parse('a', { type: 'regex', regex: /a/ });
			assert.instanceOf(obj, RegexParam);
		});
		
		test('wildcard', () => {
			var obj = ParamParser.parse('a', { type: 'wildcard', exp: 'a*b' });
			assert.instanceOf(obj, WildcardParam);
		});
		
		test('invalid', () => {
			assert.throws(() => { ParamParser.parse('a', { type: 'INVALID' }) });
		});
	});
	
	suite('Int param', () => {
		test('Default range', () => {
			var obj = ParamParser.parse('a', { type: 'int' });
			
			assert.isTrue(obj.validate(Number.MIN_VALUE));
			assert.isTrue(obj.validate(Number.MAX_VALUE));
		});
		
		test('Range set', () => {
			var obj = ParamParser.parse('a', { type: 'int', min: 2, max: 10 });
			
			assert.isTrue(obj.validate(2));
			assert.isTrue(obj.validate(10));
			assert.isFalse(obj.validate(1));
			assert.isFalse(obj.validate(11));
		});
	});
	
	suite('One of param', () => {
		test('No data set, throw error', () => {
			assert.throws(() => { ParamParser.parse('a', { type: 'array' }); });
		});
		
		test('Data not array, throw error', () => {
			assert.throws(() => { ParamParser.parse('a', { type: 'array', values: 2 }); });
		});
		
		test('Range set', () => {
			var obj = ParamParser.parse('a', { type: 'array', values: ['a', 'b'] });
			
			assert.isTrue(obj.validate('a'));
			assert.isFalse(obj.validate('c'));
		});
	});
	
	suite('Regex param', () => {
		test('No data set, throw error', () => {
			assert.throws(() => { ParamParser.parse('a', { type: 'regex' }); });
		});
		
		test('Data not a regex, throw error', () => {
			assert.throws(() => { ParamParser.parse('a', { type: 'regex', regex: 2 }); });
		});
		
		test('Valid regex', () => {
			var obj = ParamParser.parse('a', { type: 'regex', regex: /a/ });
			
			assert.isTrue(obj.validate('a'));
			assert.isFalse(obj.validate('b'));
		});
	});
	
	suite('Json param', () => {
		test('Json param created', () => {
			var obj = ParamParser.parse('a', { type: 'json' });
			assert.instanceOf(obj, JsonParam);
		});
	});
	
	suite('Wildcard param', () => {
		test('No data set, throw error', () => {
			assert.throws(() => { ParamParser.parse('a', { type: 'wildcard' }); });
		});
		
		test('Data not a string, throw error', () => {
			assert.throws(() => { ParamParser.parse('a', { type: 'wildcard', exp: 2 }); });
		});
		
		test('Valid expression', () => {
			var obj = ParamParser.parse('a', { type: 'wildcard', exp: 'a*b' });
			
			assert.isTrue(obj.validate('ab'));
			assert.isFalse(obj.validate('ac'));
			assert.isFalse(obj.validate('nab'));
		});
	});
});