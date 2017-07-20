# Regex Parameter

The URL parameter must be match a regular expression. 


**Definition**

| Property | |
| :--- | --- |
| Class path | `SeaRoute.ParamType.RegexParam` |
| Type | `'regex'` |
| Value | Primitive string |


**Config Parameters**

| Name | Description |
| :--- | --- |
| `regex` | The regex to match. Must be of type [RegExp](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp). |


**Description**

This validator does not support capture groups. As long as the URL parameter matches the expression, the entire 
parameter is passed to the route handler.


**Path Configuration Example**

```javascript
router.appendRoutes({
	// ...
	path: 'get/{id|/^001[a-z]+$/}', 
});
```

In this example, the path parameter **by** must match the expression `/^001[a-z]+$/`.

Also note that the string must start and end with '/', otherwise it will
be treated as a [Wildcard Parameter](./Wild.md).


**Configuration Example**

```javascript
router.appendRoutes({
	// ...
	params:
	{
		name: 
		{
			type:	'regex',
			exp:	/^001[a-z]+$/
		}
	}, 
});
```


**Using Predefined Instance**

```javascript
prm = new RegexParam('name', /^001[a-z]+$/);

router.appendRoutes({
	// ...
	params:
	{
		name: prm
	} 
});
```


#### References

- [Wildcard Parameter](./Wild.md) - for a simpler expression.
- [MDN: RegExp](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp)