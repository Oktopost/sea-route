'use strict';


const SeaRoute = require('../../../index');

const Part = SeaRoute.Route.Part;

const Param					= SeaRoute.ParamType.Param;
const IntParam				= SeaRoute.ParamType.IntParam;
const RegexParam			= SeaRoute.ParamType.RegexParam;
const OneOfParam			= SeaRoute.ParamType.OneOfParam;

const PathParser = SeaRoute.Parsers.PathParser;

const assert = require('chai').assert;


suite('PathParser', () => {
	suite('single parameter', () => {
		test('No name, error thrown /{|a}', () => {
			assert.throws(() => {
				PathParser.parse('/{|a}', {}, {});
			});
		});
		
		test('No config /{prm}', () => {
			var prms = {};
			PathParser.parse('/{prm}', prms, {});
			assert.deepEqual({prm : {}}, prms);
		});
		
		test('Empty config after pipeline /{prm|}', () => {
			var prms = {};
			PathParser.parse('/{prm|}', prms, {});
			assert.deepEqual({prm : {}}, prms);
		});
		
		test('Regex /{prm|/^a$/}', () => {
			var prms = {};
			PathParser.parse('/{prm|/^a$/}', prms, {});
			
			assert.instanceOf(prms.prm, RegExp);
			assert.equal('/^a$/', prms.prm.toString());
		});
		
		test('Regex with flags /{prm|/^a$/i}', () => {
			var prms = {};
			PathParser.parse('/{prm|/^a$/i}', prms, {});
			assert.instanceOf(prms.prm, RegExp);
			assert.equal('/^a$/i', prms.prm.toString());
		});
		
		test('Invalid regex, error thrown /{prm|/^}', () => {
			assert.throws(() => { 
				PathParser.parse('/{prm|/^}', {}, {});
			});
		});
		
		test('Wildcard /{prm|a*b}', () => {
			var prms = {};
			PathParser.parse('/{prm|a*b}', prms, {});
			assert.equal('a*b', prms.prm);
		});
		
		test('Array /{prm|(a|b)}', () => {
			var prms = {};
			PathParser.parse('/{prm|(a|b)}', prms, {});
			assert.deepEqual(['a', 'b'], prms.prm);
		});
		
		test('Array invalid, error thrown /{prm|(a|b}', () => {
			assert.throws(() => {
				PathParser.parse('/{prm|(a|b}', {}, {});
			});
		});
		
		test('Predefined /{prm|[aOrB]}', () => {
			var prms = {};
			var preDefined = { aOrB: {} };
			
			PathParser.parse('/{prm|[aOrB]}', prms, preDefined);
			
			assert.isTrue(prms.prm === preDefined.aOrB);
		});
		
		test('Predefined invalid, error thrown /{prm|[aOrB}', () => {
			assert.throws(() => {
				PathParser.parse('/{prm|[aOrB}', {}, { aOrB: {} });
			});
		});
		
		test('Nonexisting predefined, error thrown /{prm|[NOT_FOUND]}', () => {
			assert.throws(() => {
				PathParser.parse('/{prm|[NOT_FOUND]}', {}, {});
			});
		});
		
		test('no name, error thrown /{|abc}', () => {
			assert.throws(() => {
				PathParser.parse('/{prm|{|abc}}', {}, preDefined);
			});
		});
	});
	
	suite('Defined parameter', () => {
		test('Type redefined, throws error', () => {
			assert.throws(() => 
				{
					PathParser.parse('/{prm|a}', { prm: 'a' }, {});
				}, 
				/^Can not define parameter/);
		});
		
		test('Type defined in object', () => {
			var prms = { prm: { value: 'a' } };
			PathParser.parse('/{prm}', prms, {});
			assert.deepEqual({ prm: { value: 'a' } }, prms);
		});
		
		test('Type defined in path', () => {
			var prms = { prm: { optional: false } };
			PathParser.parse('/{prm|a}', prms, {});
			assert.deepEqual({ prm: { value: 'a', optional: false } }, prms);
		});
	});
	
	suite('complex', () => {
		test('without parameters /a/b/', () => {
			var prms = {};
			PathParser.parse('/a/b/', prms, {});
			assert.deepEqual({}, prms);
		});
		
		test('path after parameter /{a}/b', () => {
			var prms = {};
			PathParser.parse('/{a}/b/', prms, {});
			assert.deepEqual({ a: {} }, prms);
		});
		
		test('number of parameters /{a}/b/{c|/12/}/d/', () => {
			var prms = { e: {} };
			PathParser.parse('/{a}/b/{c|/12/}/d/', prms, {});
			assert.deepEqual(
				{
					e: {},
					a: {},
					c: /12/
				}, 
				prms);
		});
	});
});