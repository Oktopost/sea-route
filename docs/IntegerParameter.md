
# Integer Parameter

Value must be an integer number.

* Class path: SeaRoute.ParamType.IntParam
* Type: int

* min: optional
* max: optional


Using Object Literal:
```javascript
router.appendRoutes({
	// ...
	params:
	{
		q: 
		{ 
			type:	'int',
			min:	-1,
			max:	1000 
		}
	}, 
});
```


Using IntParam instance:
```javascript
prm = new IntParam('query');
prm.setMin(-1);

router.appendRoutes({
	// ...
	params:
	{
		query: prm
	} 
});
```


# Enum Parameter

Value must be a string that mutched one of the defined values.

* Class path: SeaRoute.ParamType.OneOfParam
* Type: array

* values: array of values

Definedin in Path
```javascript
router.appendRoutes({
	// ...
	path: '/settings/{menu|(a|b|c)}/edit'
});
```

Using Object Literal:
```javascript
router.appendRoutes({
	// ...
	params:
	{
		q: ['a', 'b', 'c', /* ... */]
	}, 
});

// Or extended version

router.appendRoutes({
	// ...
	params:
	{
		q: 
		{ 
			type:	'array',
			values:	['a', 'b', 'c', /* ... */]
		}
	}, 
});
```


Using OneOfParam instance:
```javascript
prm = new OneOfParam('query', ['name', 'age']);

router.appendRoutes({
	// ...
	params:
	{
		query: prm
	} 
});
```



# Wildcard

Value must be matching the wildcard expression.

* Class path: SeaRoute.ParamType.WildcardParam
* Type: wildcard

* exp: the wild card expression to match against the input value.

Defined in in Path
```javascript
router.appendRoutes({
	// ...
	path: '/settings/{menu|id_*}/edit'
});

```

Using Object Literal:
```javascript
router.appendRoutes({
	// ...
	params:
	{
		q: 
		{ 
			type:	'wildcard',
			exp:	'001*'
		}
	}, 
});
```


Using Wildcard instance:
```javascript
prm = new WildcardParam('query', '001*');

router.appendRoutes({
	// ...
	params:
	{
		query: prm
	} 
});
```





# Json

Value must be matching the wildcard expression.

* Class path: SeaRoute.ParamType.JsonParam
* Type: json


## Path definition

Not supported

## Using Object Literal:
```javascript
router.appendRoutes({
	// ...
	params:
	{
		q: { type:	'json' }
	}, 
});
```

## Using Instance
```javascript
prm = new JsonParam('query');

router.appendRoutes({
	// ...
	params:
	{
		query: prm
	} 
});
```


# Regex

Value must be matching the wildcard expression.

* Class path: SeaRoute.ParamType.RegexParam
* Type: json


## Path definition

```javascript
router.appendRoutes({
	// ...
	path: '/settings/{menu|/^abc$/}/edit'
});
```

## Using Object Literal:
```javascript
router.appendRoutes({
	// ...
	params:
	{
		q:
		{
			type:	'json',
			regex:	/^abc$/
		}
	}, 
});
```

## Using Instance
```javascript
prm = new RegexParam('query', /^abc$/);

router.appendRoutes({
	// ...
	params:
	{
		query: prm
	} 
});
```


