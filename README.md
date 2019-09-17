### Commands
- `npm run test`, should run the test suite and display the coverage report
- `npm run after-30-days`, should display an output similar to `products_after_30_days.txt`

###  Documentation

Pricing rules can be found in the file `./src/rules_price.js`

If you want to add new rules you can modify that file, you just have to add an object with the following structure:

| Key  | Type   | Description  |
| ------------ | ------------ | ------------ |
|  name | string   | rule name |
| hasDynamicSaleDateAndPrice  | boolean  |  flag to determine if the price will be fixed|
| minPrice  | number  |  minimum insurance price |
| maxPrice  | number  |  maximum insurance price|
| rules  | object  |  rules to determine the price |

##### Rules
| Key  | Type   | Description  |
| ------------ | ------------ | ------------ |
|  fnPrice | string   | name the operation to be performed: **increment** or **decrement** |
|  value | number   | operation value |
|  conditional | object | key with the parameters of the condition to evaluate |
|  field | string   | field to evaluate |
|  operator | string   | condition operator |
|  comparator | number   | condition comparator |

```
 {
		name: 'any',
		hasDynamicSaleDateAndPrice: true,
		minPrice: 0,
		maxPrice: 50,
		rules: [{
			fnPrice: 'decrement',
			value: +1
		},
		{
			'conditional': {
				field: 'sellIn',
				operator: '<',
				comparator: 1,
			},
			fnPrice: 'decrement',
			value: +1
		}]
	}
```
