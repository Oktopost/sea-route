# Integer Parameter

The URL parameter must be any string that can be parsed by JavaScript as a number.


**Definition**

| Property | |
| :--- | --- |
| Class path | `SeaRoute.ParamType.IntParam` |
| Type | `'int'` |
| Value | Primitive number |


**Config Parameters**

| Name | Description |
| :--- | --- |
| `min` *(optional)* | Inclusive minimum acceptable value for the parameter. |
| `max` *(optional)* | Inclusive maximum acceptable value for the parameter. |


**Description**

Floats are rounded to the nearest integer. For example
parameter **A** in URL URL https://..../home?**A=32.64** will be equal to 33.

Non standard representations of integer like **0x10** and **12e4** will also be accepted.


**Configuration Example**
```javascript
router.appendRoutes({
	// ...
	params:
	{
		q: 
		{ 
			type:	'int',
			min:	0,
			max:	1000 
		}
	}, 
});
```


**Using Predefined Instance**
```javascript
prm = new IntParam('query');
prm.setMin(-10);
prm.setMax(10);

router.appendRoutes({
	// ...
	params:
	{
		query: prm
	} 
});
```


#### References

- [Number Parameter](./Number.md) - will match any numbers; both integer and float.
- [MDN: parseFloat](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/parseFloat)