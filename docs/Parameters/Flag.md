# Flag Parameter

Flag parameter is a path only parameter that can be used to indicate if part of the path is present. 


**Definition**

| Property | |
| :--- | --- |
| Class path | `SeaRoute.ParamType.FlagParam` |
| Type | Unavailable |
| Value | Primitive boolean |


**Config Parameters**

Unavailable


**Description**

This parameter can be defined only in the Path. 


Also technical it's instance can be used in the parameters config object, this should be avoided.

FlagParameter's value will be always present in the set passed to route's handler.
It's value will be either `true` or `false`. This is contrary to other parameters; when marked as optional and 
without a default value, a parameter that is missing from URL will not be present in the object passed to
route's handler. 


**Path Configuration Example**

```javascript
router.appendRoutes({
	// ...
	path: 'search/{?users}', 
});
```

|For location|Parameters|
| :--- | --- |
| https://.../search/ | `{ users: false }` |
| https://.../search/users | `{ users: true }` |

Locations like *https://.../search/us* and *https://.../search/users/abc* will not match the config above.
