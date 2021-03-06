# Integer Parameter

The URL parameter must be match one of the values in a predefined set. 


**Definition**

| Property | |
| :--- | --- |
| Class path | `SeaRoute.ParamType.OneOfParam` |
| Type | `'array'`, `'enum'` |
| Value | Primitive string |


**Config Parameters**

| Name | Description |
| :--- | --- |
| `values` | Array of expected values |


**Description**

The array of values should contain only strings. Any other value will never match a parameter from the URL. 

Passing an empty data set will result in an exception.


**Path Configuration Example**

```javascript
router.appendRoutes({
	// ...
	path: 'search/{by|(name|age|date)}', 
});
```

In this example, the path parameter **by** must be `'name'`, `'age'` or `'date'`.


**Configuration Example**

```javascript
// Long notation
router.appendRoutes({
	// ...
	params:
	{
		by: 
		{
			// type: 'array'
			type:	'enum',
			values: ['name', 'age', 'date'] 
		}
	}, 
});

// Short notation
router.appendRoutes({
	// ...
	params:
	{
		by: ['name', 'age', 'date']
	}, 
});
```


**Using Predefined Instance**

```javascript
prm = new OneOfParam('by', ['name', 'age', 'date']);

router.appendRoutes({
	// ...
	params:
	{
		query: prm
	} 
});
```