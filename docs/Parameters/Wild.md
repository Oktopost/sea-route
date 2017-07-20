# Wildcard Parameter

The url parameter must be match a simple wildcard expression. 


**Definition**

| Property | |
| :--- | --- |
| Class path | `SeaRoute.ParamType.WildcardParam` |
| Type | `'wild'`, `'wildcard'` |
| Value | Primitive string |


**Config Parameters**

| Name | Description |
| :--- | --- |
| `exp` | The wildcard expression to match. |


**Description**

In the current version, wildcard expression is converted into a regex expression, therefor any special characters
inside this expression, that are also used by regex, may cause side effects. It's best to use wildcard parameter 
for a simple expressions, like prefix/suffix validation. For example `target: '*/path/*'`.


**Path Definition**

```javascript
router.appendRoutes({
	// ...
	path: 'get/{id|name_*}', 
});
```

In this example, the path parameter **by** must start with `'name_'`.


**Object Literal Definition**

```javascript
router.appendRoutes({
	// ...
	params:
	{
		name: 
		{
			// type: 'wildcard'
			type:	'wild',
			exp:	['name_*'] 
		}
	}, 
});
```


**Using Predefined Instance**

```javascript
prm = new WildcardParam('name', ['name_*']);

router.appendRoutes({
	// ...
	params:
	{
		name: prm
	} 
});
```


#### References

- [Regex Parameter](./Regex.md) - for a more complex regular expression.