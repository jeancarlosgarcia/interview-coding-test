const rules = {
	'any': {
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
	},
	'mega_coverage': {
		name: 'mega_coverage',
		hasDynamicSaleDateAndPrice: false
	},
	'full_coverage': {
		name: 'full_coverage',
		hasDynamicSaleDateAndPrice: true,
		minPrice: 0,
		maxPrice: 50,
		rules: [{
			fnPrice: 'increase',
			value: +1
		},
		{
			'conditional': {
				field: 'sellIn',
				operator: '<',
				comparator: 1,
			},
			fnPrice: 'increase',
			value: +1
		}]
	},
	'special_full_coverage': {
		name: 'special_full_coverage',
		hasDynamicSaleDateAndPrice: true,
		minPrice: 0,
		maxPrice: 50,
		rules: [{
			fnPrice: 'increase',
			value: +1
		},
		{
			'conditional': {
				field: 'sellIn',
				operator: '<',
				comparator: 6,
			},
			fnPrice: 'increase',
			value: +1
		},
		{
			'conditional': {
				field: 'sellIn',
				operator: '<',
				comparator: 11,
			},
			fnPrice: 'increase',
			value: +1
		},
		{
			'conditional': {
				field: 'sellIn',
				operator: '<',
				comparator: 1,
			},
			fnPrice: 'decrement',
			value: +55
		}]
	},
	'super_sale': {
		name: 'super_sale',
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
				comparator: 1
			},
			fnPrice: 'decrement',
			value: +1
		}]
	}
};

module.exports = rules;
