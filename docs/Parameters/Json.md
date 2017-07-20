# Json Parameter

The URL parameter must be a valid json string.


**Definition**

| Property | |
| :--- | --- |
| Class path | `SeaRoute.ParamType.JsonParam` |
| Type | `'json'` |
| Value | Depending on the json can be one of: Primitive bool, number, string; null value; object literal; array |


**Config Parameters**

_None_


**Description**

Any valid json string is acceptable. That includes:
 
* `"string"`
* `123` - number 
* `true` - boolean 
* `null` - *null* value
* `{"a": 123}` - Object literal
* `[1, 2, 'c']` - Array

The result of [JSON](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON).parse() is the value that is passed to the callback.


**Configuration Example**

```javascript
router.appendRoutes({
	// ...
	params:
	{
		q: { type: 'json' }
	}, 
});
```


**Using Predefined Instance**

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


#### References

- [MDS: JSON](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON)