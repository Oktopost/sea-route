namespace('SeaRoute.Parsers', function(root)
{
	var is			= root.Plankton.is;
	var array		= root.Plankton.array;
	var classify	= root.Classy.classify;
	
	
	/**
	 * @name SeaRoute.Parsers.PathParser
	 */
	var PathParser = {
		
		/**
		 * @param {string} name
		 * @param {string|RegExp|string[]} value
		 * @param {{}} config
		 * @private
		 */
		_setParam: function (name, value, config)
		{
			if (is.undefined(config[name]))
			{
				config[name] = value;
				return;
			} 
			
			var param = config[name]; 
				
			if (is.string(param) || 
				param instanceof RegExp || 
				is.array(param) || 
				is.defined(config[name].value) || 
				is.defined(config[name].type))
			{
				throw new Error('Can not define parameter type both in Path ' + 
					'and in config. For parameter "' + name + '"');
			} 
			else
			{
				config[name].value = value;
			}
		},
		
		
		/**
		 * @param {string} name
		 * @param {{}} config
		 * @private
		 */
		_simpleParam: function (name, config)
		{
			if (is.undefined(config[name]))
			{
				config[name] = {};
			}
		},

		/**
		 * @param {string} name
		 * @param {string} regex
		 * @param {{}} config
		 * @private
		 */
		_regexParam: function (name, regex, config)
		{
			var lastIndex = regex.lastIndexOf('/');
			
			if (lastIndex <= 1)
			{
				throw new Error('Invalid regex expresion: "' + regex + '"');
			}
			
			var exp = regex.substr(1, lastIndex - 1);
			var flags = regex.substr(lastIndex + 1);
			
			this._setParam(name, new RegExp(exp, flags), config);
		},

		/**
		 * @param {string} name
		 * @param {string} valuesString
		 * @param {{}} config
		 * @private
		 */
		_arrayParam: function (name, valuesString, config)
		{
			if (valuesString[valuesString.length - 1] !== ')')
			{
				throw new Error('Invalid array config for parameter named "' + name + '"');
			}
			
			this._setParam(name, valuesString.substr(1, valuesString.length - 2).split('|'), config);
		},

		/**
		 * @param {string} name
		 * @param {string} predefined
		 * @param {{}} config
		 * @param {{}} predefinedCollection
		 * @private
		 */
		_predefinedParam: function (name, predefined, config, predefinedCollection)
		{
			if (predefined[predefined.length - 1] !== ']')
			{
				throw new Error('Invalid array config for parameter named "' + name + '"');
			}
			
			predefined = predefined.substr(1, predefined.length - 2);
			
			if (is.undefined(predefinedCollection[predefined]))
			{
				throw new Error('There is no predefined parameter named "' + predefined + '"');
			}
			
			this._setParam(name, predefinedCollection[predefined], config);
		},
		
		/**
		 * @param {string} path
		 * @return {string[]}
		 * @private
		 */
		_getParameterParts: function (path)
		{
			var params = [];
			var offset = 0;
			var firstIndex;
			var lastIndex;
			
			while (offset < path.length)
			{
				firstIndex	= path.indexOf('{', offset);
				lastIndex	= path.indexOf('}', offset);
				
				if (firstIndex === -1 || lastIndex === -1)
					break;
				
				params.push(path.substr(firstIndex + 1, lastIndex - firstIndex - 1));
				offset = lastIndex + 1;
			}
			
			return params;
		},

		/**
		 * @param {string} param
		 * @param {{}} config
		 * @param {{}} preDefinedParams
		 * @private
		 */
		_parseParam: function (param, config, preDefinedParams)
		{
			var pipelineIndex = param.indexOf('|');
			var name;
			var value;
			
			// Simple parameter
			if (pipelineIndex === -1) {
				this._simpleParam(param, config);
				return;
			} else if (pipelineIndex === param.length - 1 && pipelineIndex > 0) {
				this._simpleParam(param.substr(0, param.length - 1), config);
				return;
			}
			
			name = param.substr(0, pipelineIndex);
			value = param.substr(pipelineIndex + 1);
			
			if (name.length === 0)
			{
				throw new Error('Parameter name not provided');		
			}
			// Regex
			else if (value[0] === '/')
			{
				this._regexParam(name, value, config);
			}
			// Array selection
			else if (value[0] === '(')
			{
				this._arrayParam(name, value, config);
			}
			// Predefined param
			else if (value[0] === '[')
			{
				this._predefinedParam(name, value, config, preDefinedParams);
			}
			// Wildcard
			else
			{
				this._setParam(name, value, config);
			}
		},
		
		
		/**
		 * @param {string} path
		 * @param {{}} config
		 * @param {{}} preDefinedParams
		 */
		parse: function (path, config, preDefinedParams)
		{
			var pathParams = this._getParameterParts(path);
			
			array.forEach(pathParams, function (param)
			{
				PathParser._parseParam(param, config, preDefinedParams);
			});
		}
	};
	
	
	this.PathParser = classify(PathParser);
});