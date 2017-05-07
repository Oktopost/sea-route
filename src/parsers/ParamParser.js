require('../../namespace').namespace('SeaRoute.parsers', function(root) {
	'use strict';
	
	
	var params		= root.SeaRoute.params;
	
	var is			= root.Plankton.is;
	var array		= root.Plankton.array;
	var classify	= root.Classy.classify;
	
	
	/**
	 * @name SeaRoute.parsers.ParamParser
	 */
	var ParamParser = {
		FLAGS: {
			DEFAULT_VALUE:	'def',
			AUTO_FILL:		'fill',
			OPTIONAL:		'optional',
			VALUE:			'value',
			TYPE:			'type'
		},
		
		TYPES: { 
			INT:		'int',
			ARRAY:		'array',
			REGEX:		'regex',
			WILDCARD:	'wildcard'
		},
		
		CREATORS: {
			'int': 			'_createIntParam',
			'array': 		'_createOneOfParam',
			'regex': 		'_createRegexParam',
			'wildcard': 	'_createWildcardParam',
		},
		
		
		_createIntParam: function (name, config) {
			var param = new params.IntParam(name);
			
			if (is.defined(config.min) && is.number(config.min)) {
				param.setMin(config.min)
			}
			
			if (is.defined(config.max) && is.number(config.max)) {
				param.setMax(config.max)
			}
			
			return param;
		},
		
		_createOneOfParam: function (name, config) {
			if (!is.array(config.values)) {
				throw 'The config "values" is required for param of type "array" and must be an Array of strings'; 
			}
			
			return new params.OneOfParam(name, ['a']);
		},
		
		_createRegexParam: function (name, config) {
			if (is.undefined(config.regex) || !(config.regex instanceof RegExp)) {
				throw 'The config "regex" is required for param of type "regex" and must be a RegExp object'; 
			}
			
			return new params.RegexParam(name, config.regex);
		},
		
		_createWildcardParam: function (name, config) {
			if (!is.string(config.exp)) {
				throw 'The config "exp" is required for param of type "wildcard" and must be a string'; 
			}
			
			return new params.RegexParam(name, new RegExp(config.exp.replace('*', '.*')));
		},
		
		
		/**
		 * @param {string} name
		 * @param {{}|[]|string|RegExp|SeaRoute.params.Param} config
		 * @return {SeaRoute.params.Param}
		 * @private
		 */
		_createByType: function (name, config) {
			if (!is.defined(config[this.FLAGS.TYPE])) {
				return new params.Param(name);
			}
			
			var type = config[this.FLAGS.TYPE];
			
			if (is.undefined(this.CREATORS[type])) {
				throw 'Invalid type ' + type;
			}
			
			return (this[this.CREATORS[type]])(name, config);
		},

		/**
		 * @param {string} name
		 * @param {{}|[]|string|RegExp|SeaRoute.params.Param} config
		 * @return {SeaRoute.params.Param}
		 * @private
		 */
		_createParam: function (name, config) {
			if (is.array(config)) {
				return new params.OneOfParam(name, config);
			} else if (is.string(config)) {
				return new params.RegexParam(name, new RegExp(config.replace('*', '.*')));
			} else if (config instanceof params.Param) {
				return new params.ConstParamDecorator(name, config);
			} else if (config instanceof RegExp) {
				return new params.RegexParam(name, config);
			} else if (!is.object(config)) {
				throw 'Unexpected route config for ' + name + ', got ' + JSON.stringify(config);
			} else if (is.defined(config[this.FLAGS.VALUE])) {
				return this._createParam(name, config[this.FLAGS.VALUE]);
			} else {
				return this._createByType(name, config);
			}
		},

		/**
		 * @param {SeaRoute.params.Param} prm
		 * @param {object} config
		 * @private
		 */
		_setGenericConfig: function (prm, config) {
			
			// Set default value
			if (is.defined(config[this.FLAGS.DEFAULT_VALUE])) {
				prm.setDefaultValue(config[this.FLAGS.DEFAULT_VALUE]);
			}
			
			// Set optional flag.
			if (is.defined(config[this.FLAGS.OPTIONAL])) {
				prm.setIsOptional(is(config[this.FLAGS.OPTIONAL]));
			}
			
			// Set auto fill flag.
			if (is.defined(config[this.FLAGS.AUTO_FILL])) {
				if (!prm.hasDefaultValue()) {
					throw 'Default value must be provided for a url with the "' + this.FLAGS.AUTO_FILL + '" flag';
				}
				
				prm.setIsAutoFillURL(is(config[this.FLAGS.AUTO_FILL]));
			}
		},
		
		
		/**
		 * @param {string} name
		 * @param {{}|[]|string|RegExp|SeaRoute.params.Param} object
		 * @return {SeaRoute.params.Param}
		 */
		parse: function (name, object) {
			var param = this._createParam(name, object);
			
			if (is.object(object) && !(object instanceof params.Param)) {
				this._setGenericConfig(param, object);
			}
			
			
			return param;
		}
	};
	
	
	this.ParamParser = classify(ParamParser);
});