# Integer Parameter

The URL parameter must be any string that can be parsed by JavaScript as a number.


**Definition**

| Property | |
| :--- | --- |
| Class path | `SeaRoute.ParamType.NumberParam` |
| Type | `'num'`, `'number'` |
| Value | Primitive number |


**Config Parameters**

| Name | Description |
| :--- | --- |
| `min` *(optional)* | Inclusive minimum acceptable value for the parameter. |
| `max` *(optional)* | Inclusive maximum acceptable value for the parameter. |


**Description**

Unlike [Integer Parameter](./Int.md), float values are not rounded.

Non standard representations of integer like **0x10** and **12e4** will also be accepted.


**Configuration Example**

```javascript
router.appendRoutes({
	// ...
	params:
	{
		q: 
		{
			// type: 'number'
			type:	'num',
			min:	0,
			max:	1000 
		}
	}, 
});
```


**Using Predefined Instance**

```javascript
prm = new NumberParam('query');
prm.setMin(0.1);
prm.setMax(99.9);

router.appendRoutes({
	// ...
	params:
	{
		query: prm
	} 
});
```


#### References

- [Integer Parameter](./Int.md) - will match any number but floats are rounded.
- [MDN: parseFloat](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/parseFloat)