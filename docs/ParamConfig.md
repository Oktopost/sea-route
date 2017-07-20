# Parameter Configuration


#### Table Of Contents

  * [Predefined Input Validation Objects](#predefined-input-validation-objects)
  * [Config Options](#config-options)
    * [Type](#type-type)
    * [Optional Flag](#optional-flag-optional)
    * [Default Value](#default-value-def)
    * [Auto Fill](#auto-fill-fill)
  * [References](#references)


## Config Options  

### Type, `'type'`

### Optional Flag, `'optional'`

If a parameter is marked as optional, a URL location that is missing this parameter may still 
match the route. A non optional parameter must be present in the URL request.

**Default Values**
* For query parameters, optional is by default `true`.
* For path parameters, optional is by default `false`.  

**Example**:
```javascript
var config = {
	optional: true
};
```


### Default Value, `'def'`

Default value is the value that is used if the parameter is not present in the URL.

**Example**:
```javascript
var config = {
	def: 'abc'
}
```


### Auto Fill, `'fill'`

**Example**:
```javascript
var config = {
	fill: false
}
```


### Additional Parameters

According to parameter's type, additional options may be required or available. For example 
the [Number Parameter](./Parameters/Number.md) type also accepts optional `min` and `max` options. 


## Example

```javascript
var config = {
	
	// The type of parameter: must be integer
	type: 		'int',
	
	// Do not append to the redirect URL if not required.
	fill:		false,
	
	// If the parameter is not present, it's value is set to 1.
	def:		1,
	
	// This parameter is an optional parameter.
	optional:	true
}
```


#### References

- [Predefined Parameter Types](./ParamValidation.md) - set of predefined parameter types.