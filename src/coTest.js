class Product {
  constructor(name, sellIn, price) {
    this.name = name;
    this.sellIn = sellIn;
    this.price = price;
  }

  getPrice() {
    return this.price;
  }

  setPrice(price) {
    if (price < 0)
      throw new Error('price invalid');

    this.price = price;
  }

  decrementSellIn() {
    this.sellIn = this.sellIn - 1;
  }
}

class CarInsurance {
  constructor(products = [], rules) {
    this.products = products;
    this.insurance = rules;
    this.totalTemp = {
      increase: 0,
      decrement: 0
    };
  }

  getInsurance(product) {
    const insuranceName = product.name
      .toLowerCase()
      .replace(/ /g, '_')
      .replace(/[^\w-]+/g, '');

    return this.insurance
      .hasOwnProperty(insuranceName) ? this.insurance[insuranceName] : this.insurance['any'];
  }

  increasePrice(price, value = 1, maxPrice = 50) {
    let newPrice = price + value;
    if (newPrice > maxPrice) newPrice = maxPrice;
    return newPrice;
  }

  descrementPrice(price, value = 1, minPrice = 0) {
    let newPrice = price - value;
    if (newPrice < minPrice) newPrice = minPrice;
    return newPrice;
  }

  clearTotalTemp() {
    this.totalTemp = {
      increase: 0,
      decrement: 0
    };
  }

  updateTotalTemp(key, value) {
    this.totalTemp[key] = value;
  }

  evaluateRuleConditional(product, rule) {
    const conditional = rule.conditional;
    if (eval(product[conditional.field] + conditional.operator + conditional.comparator)) {
      this.updateTotalTemp(rule.fnPrice, rule.value);
    }
  }

  calculateInsurancePrice(product, insurance) {
    this.clearTotalTemp()

    if (!insurance.hasOwnProperty('hasDynamicSaleDateAndPrice'))
      throw new Error('configuration [hasDynamicSaleDateAndPrice] is required');

    if (!insurance.hasOwnProperty('rules') || insurance.rules.length === 0)
      throw new Error('unknown rules');

    insurance.rules.forEach(rule => {
      if (rule.hasOwnProperty('conditional')) {
        this.evaluateRuleConditional(product, rule);
      } else {
        this.updateTotalTemp(rule.fnPrice, rule.value);
      }
    });

    if (this.totalTemp.increase > this.totalTemp.decrement) {
      return this.increasePrice(product.price, this.totalTemp.increase - this.totalTemp.decrement, insurance.maxPrice);
    } else {
      return this.descrementPrice(product.price, this.totalTemp.decrement - this.totalTemp.increase, insurance.minPrice);
    }

  }

  verifyInsurance(product) {
    const insurance = this.getInsurance(product);
    if (!insurance.hasDynamicSaleDateAndPrice) return false;

    const newPrice = this.calculateInsurancePrice(product, insurance);
    product.setPrice(newPrice);
    product.decrementSellIn();

  }

  updatePrice() {
    const _this = this;
    this.products.forEach(product => _this.verifyInsurance(product));
    return this.products;
  }
}

module.exports = {
  Product,
  CarInsurance
}
