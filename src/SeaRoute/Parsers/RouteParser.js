namespace('SeaRoute.Parsers', function(root, SeaRoute) {
	'use strict';
	
	
	var Path		= root.SeaRoute.Route.Path;
	var Part		= root.SeaRoute.Route.Part;
	var Route		= root.SeaRoute.Route.Route;
	var PathParser	= root.SeaRoute.Parsers.PathParser;
	var ParamParser	= root.SeaRoute.Parsers.ParamParser;
	
	var is			= root.Plankton.is;
	var obj			= root.Plankton.obj;
	var array		= root.Plankton.array;
	var classify	= root.Classy.classify;
	
	
	/**
	 * @name SeaRoute.Parsers.RouteParser
	 */
	var RouteParser = {
		/**
		 * @param {{}} config
		 * @param {{}} predefined
		 * @private
		 */
		_extractPathParams: function (config, predefined) {
			PathParser.parse(config.path, config.params, predefined);
		},
		
		/**
		 * @param {{}} config
		 * @return {{}}
		 * @private
		 */
		_parseParameters: function (config) {
			obj.forEach.pair(config.params, function (key, value) {
				config.params[key] = ParamParser.parse(key, value);
			});
		},
		
		/**
		 * @param {{}} config
		 * @return {SeaRoute.Route.Path}
		 * @private
		 */
		_createPath: function (config) {
			var path = new Path(config.path);
			var str = config.path.toString();
			var part;
			var name;
			var paramName;
			var index;
			var pipelineIndex;
			

			while (str.length > 0) {
				if (str[0] === '/') {
					str = str.substr(1);
				
				// Create parameter
				} else if (str[0] === '{') {
					pipelineIndex 	= str.indexOf('|');
					index			= str.indexOf('}');
					name			= str.substr(0, index + 1);
					
					if (pipelineIndex >= 0 && pipelineIndex < index)
					{
						paramName = str.substr(1, pipelineIndex - 1);
					}
					else if (index !== -1)
					{
						paramName = str.substr(1, index - 1);
					}
					else
					{
						throw new Error('Invalid path defined: ' + config.path.toString());
					}
					
					if (paramName[0] === '?') 
					{
						paramName = paramName.substr(1);	
					}
					
					part = new Part(name);
					part.setParam(config.params[paramName]);
					path.addPart(part);
					
					str = str.substr(index + 1);
				
				// Last const parameter
				} else if (str.indexOf('/') === -1) {
					path.addPart(new Part(str));
					break;
					
				// Const parameter
				} else {
					index	= str.indexOf('/');
					name	= str.substr(0, index);
					str		= str.substr(index + 1);
				
					path.addPart(new Part(name));
				}
			}
			
			return path;
		},
		
		/**
		 * @param {SeaRoute.Route.Path} path
		 * @param {{}} config
		 * @private
		 */
		_createRoute: function (path, config) {
			var route = new Route(path, config.callback);
			var allParams = {}; 
			
			obj.forEach.key(config.params, function (key) {
				allParams[key] = true;
			});
			
			array.forEach(path.parts(),
				/**
				 * @param {SeaRoute.Route.Part} part
				 */
				function (part) {
					if (!part.isConst()) {
						delete allParams[part.getParamName()];
					}
				});
			
			obj.forEach.key(allParams, function (paramName) {
				route.addQueryParam(config.params[paramName]);
			});
			
			return route;
		},
		
		/**
		 * @param {*} config
		 * @private
		 */
		_validate: function (config) {
			if (!is.string(config.path)) {
				throw 'Path not set for route';
			} else if (config.path === '' || config.path[0] !== '/') {
				config.path = '/' + config.path; 
			}
			
			if (!is.function(config.callback)) {
				throw 'Callback not set for route';
			}
			
			if (!is.object(config.params)) {
				config.params = {};
			}
		},
		
		
		/**
		 * @param {{}} config
		 * @param {{}} predefined
		 * @return {SeaRoute.Route.Route}
		 */
		parse: function (config, predefined) {
			var route;
			var path;
			
			this._validate(config);
			this._extractPathParams(config, predefined);
			this._parseParameters(config);
			path = this._createPath(config);
			route = this._createRoute(path, config);
			
			return route;
		}
	};
	
	
	this.RouteParser = classify(RouteParser);
});