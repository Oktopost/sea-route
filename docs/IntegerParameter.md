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
prm.setMin(-1);

router.appendRoutes({
	// ...
	params:
	{
		query: prm
	} 
});
```