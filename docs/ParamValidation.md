# Parameter Validation 

#### Table Of Contents

  * [Predefined Input Validation Objects](#predefined-input-validation-objects)
  * [Creating Costume Validation Object](#creating-costume-validation-object)

### Predefined Input Validation Objects

| Type | Description |
| --- | --- |
| [Integer](./Parameters/Int.md)|Accept any integer numbers (float numbers are rounded). |
| [Number](./Parameters/Number.md)|Accept any number; float or integer. |
| [Json](./Parameters/Json.md)|Accept a valid json string only. | 
| [Enum](./Parameters/Enum.md)|The input parameter must match one of the values in a predefined array. |
| [Wildcard](./Parameters/Wild.md)|The input must match a simple wildcard expression. |
| [Regex](./Parameters/Regex.md)|The input must match a regular expression. |


### Creating Costume Validation Object

To create a costume validatin object you must extend the `SeaRoute.ParamType.Param` class and 
override the relevant methods

Another option is to use the `SeaRoute.ParamType.CallbackParam` object. It's constructor accepts 
a set of callbacks that are used for parameter validation, parsing and encoding.

Parameter validation is divided into 3 operations:
1. **Validation**: Validate that the string value passed from the URL matches a set of given rules.
2. **Parsing**: Convert the url parameter from string into a value that will be passed to the route handler. 
This action is called only if the validation was successful.
3. **Encoding**: Convert a variable to it's string representation that can be used in a redirect link. 
This operation is invoked when a redirect is requested from JavaScript and not when parsing current URL.