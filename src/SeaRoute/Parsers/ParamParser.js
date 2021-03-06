namespace('SeaRoute.Parsers', function(root)
{
	var Param			= root.SeaRoute.ParamType.Param;
	var IntParam		= root.SeaRoute.ParamType.IntParam;
	var NumberParam		= root.SeaRoute.ParamType.NumberParam;
	var OneOfParam		= root.SeaRoute.ParamType.OneOfParam;
	var RegexParam		= root.SeaRoute.ParamType.RegexParam;
	var JsonParam		= root.SeaRoute.ParamType.JsonParam;
	var WildcardParam	= root.SeaRoute.ParamType.WildcardParam;
	
	var PredefinedParamDecorator	= root.SeaRoute.ParamType.PredefinedParamDecorator;
	
	
	var is			= root.Plankton.is;
	var array		= root.Plankton.array;
	var classify	= root.Classy.classify;
	
	
	/**
	 * @name SeaRoute.Parsers.ParamParser
	 */
	var ParamParser = {
		FLAGS:
		{
			DEFAULT_VALUE:	'def',
			AUTO_FILL:		'fill',
			OPTIONAL:		'optional',
			VALUE:			'value',
			TYPE:			'type'
		},
		
		TYPES:
		{
			INT:		'int',
			ARRAY:		'array',
			REGEX:		'regex',
			JSON:		'json',
			WILDCARD:	'wildcard'
		},
		
		CREATORS:
		{
			'num': 			'_createNumberParam',
			'number':		'_createNumberParam',
			
			'enum': 		'_createOneOfParam',
			'array': 		'_createOneOfParam',
			
			'int': 			'_createIntParam',
			'regex': 		'_createRegexParam',
			'json': 		'_createJsonParam',
			
			'wild': 		'_createWildcardParam',
			'wildcard': 	'_createWildcardParam',
		},
		
		
		_setMinMax: function (param, config)
		{
			if (is.defined(config.min) && is.number(config.min))
				param.setMin(config.min);
			
			if (is.defined(config.max) && is.number(config.max))
				param.setMax(config.max);
			
			return param;
		},
		
		
		_createNumberParam: function (name, config)
		{
			var param = new NumberParam(name);
			return ParamParser._setMinMax(param, config);
		},
		
		_createIntParam: function (name, config)
		{
			var param = new IntParam(name);
			return ParamParser._setMinMax(param, config);
		},
		
		_createOneOfParam: function (name, config)
		{
			if (!is.array.notEmpty(config.values))
			{
				throw new Error('The config "values" is required for param of type "array" and must be an Array of strings'); 
			}
			
			return new OneOfParam(name, config.values);
		},
		
		_createRegexParam: function (name, config)
		{
			if (is.undefined(config.regex) || !(config.regex instanceof RegExp))
			{
				throw new Error('The config "regex" is required for param of type "regex" and must be a RegExp object'); 
			}
			
			return new RegexParam(name, config.regex);
		},
		
		_createJsonParam: function (name)
		{
			return new JsonParam(name);
		},
		
		_createWildcardParam: function (name, config)
		{
			if (!is.string(config.exp))
			{
				throw new Error('The config "exp" is required for param of type "wildcard" and must be a string'); 
			}
			
			return new WildcardParam(name, config.exp);
		},
		
		
		/**
		 * @param {string} name
		 * @param {{}|[]|string|RegExp|SeaRoute.ParamType.Param} config
		 * @return {SeaRoute.ParamType.Param}
		 * @private
		 */
		_createByType: function (name, config)
		{
			if (!is.defined(config[this.FLAGS.TYPE]))
			{
				return new Param(name);
			}
			
			var type = config[this.FLAGS.TYPE];
			
			if (is.undefined(this.CREATORS[type]))
			{
				throw 'Invalid type ' + type;
			}
			
			return (this[this.CREATORS[type]])(name, config);
		},

		/**
		 * @param {string} name
		 * @param {{}|[]|string|RegExp|SeaRoute.ParamType.Param} config
		 * @return {SeaRoute.ParamType.Param}
		 * @private
		 */
		_createParam: function (name, config)
		{
			if (is.array(config))
			{
				return new OneOfParam(name, config);
			}
			else if (is.string(config))
			{
				return new RegexParam(name, new RegExp(config.replace('*', '.*')));
			}
			else if (config instanceof Param)
			{
				return new PredefinedParamDecorator(name, config);
			}
			else if (config instanceof RegExp)
			{
				return new RegexParam(name, config);
			}
			else if (!is.object(config))
			{
				throw new Error('Unexpected route config for ' + name + ', got ' + JSON.stringify(config));
			}
			else if (is.defined(config[this.FLAGS.VALUE]))
			{
				return this._createParam(name, config[this.FLAGS.VALUE]);
			}
			else
			{
				return this._createByType(name, config);
			}
		},
		
		/**
		 * @param {SeaRoute.ParamType.Param} prm
		 * @param {object} config
		 * @private
		 */
		_setGenericConfig: function (prm, config) {
			
			// Set default value
			if (is.defined(config[this.FLAGS.DEFAULT_VALUE]))
			{
				prm.setDefaultValue(config[this.FLAGS.DEFAULT_VALUE]);
			}
			
			// Set optional flag.
			if (is.defined(config[this.FLAGS.OPTIONAL]))
			{
				prm.setIsOptional(is(config[this.FLAGS.OPTIONAL]));
			}
			
			// Set auto fill flag.
			if (is.defined(config[this.FLAGS.AUTO_FILL]))
			{
				if (!prm.hasDefaultValue())
				{
					throw new Error(
						'Default value must be provided for a url with the "' + this.FLAGS.AUTO_FILL + '" flag');
				}
				
				prm.setIsAutoFillURL(is(config[this.FLAGS.AUTO_FILL]));
			}
		},
		
		
		/**
		 * @param {string} name
		 * @param {{}|[]|string|RegExp|SeaRoute.ParamType.Param} object
		 * @return {SeaRoute.ParamType.Param}
		 */
		parse: function (name, object)
		{
			var param = this._createParam(name, object);
			
			if (is.object(object) && !(object instanceof Param))
			{
				this._setGenericConfig(param, object);
			}
			
			
			return param;
		}
	};
	
	
	this.ParamParser = classify(ParamParser);
});