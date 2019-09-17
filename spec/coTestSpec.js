const expect = require('chai').expect;

const rules = require('../src/rules_price');
const coTest = require('../src/coTest');
const CarInsurance = coTest.CarInsurance;
const Product = coTest.Product;

describe('Product', function () {
  let product;

  beforeEach(() => {
    product = new Product('Medium Coverage', 10, 20);
  });

  it('return the price', () => {
    expect(product.getPrice()).to.equal(20);
  });

  it('update the price', () => {
    product.setPrice(10);
    expect(product.getPrice()).to.equal(10);
  });

  it('return the price invalid', () => {
    expect(() => {
      product.setPrice(-10);
    }).to.throw();
  });

  it('return the sellIn', () => {
    expect(product.sellIn).to.equal(10);
  });

  it('update the sellIn', () => {
    product.decrementSellIn();
    expect(product.sellIn).to.equal(9);
  });

});

describe('CarInsurance', function () {
  let carInsurance;

  beforeEach(() => {
    carInsurance = new CarInsurance([], rules);
  });

  describe('#getInsurance', () => {
    it('return any insurance', () => {
      const insurance = carInsurance.getInsurance(new Product('Medium Coverage', 0, 0));
      expect(insurance.name).to.equal('any');
    });

    it('return recognized insurance', () => {
      const insurance = carInsurance.getInsurance(new Product('Full Coverage', 0, 0));
      expect(insurance.name).to.equal('full_coverage');
    });
  });

  describe('#increasePrice', () => {
    it('returns the increased price', () => {
      const newprice = carInsurance.increasePrice(1, 1);
      expect(newprice).to.equal(2);
    });

    it('returns the truncated number at the maximum value when increasing', () => {
      const maxPrice = 60;
      const newprice = carInsurance.increasePrice(1, 60, maxPrice);
      expect(newprice).to.equal(maxPrice);
    });
  });

  describe('#descrementPrice', () => {
    it('returns the descrement price', () => {
      const newprice = carInsurance.descrementPrice(1, 1);
      expect(newprice).to.equal(0);
    });

    it('returns the truncated number at the minimum value when descrement', () => {
      const minPrice = 0;
      const newprice = carInsurance.descrementPrice(1, 10, minPrice);
      expect(newprice).to.equal(minPrice);
    });
  });

  describe('#clearTotalTemp', () => {
    it('returns the temporary values at 0', () => {
      carInsurance.totalTemp.increase = 1;
      carInsurance.totalTemp.decrement = 1;
      carInsurance.clearTotalTemp();

      expect(carInsurance.totalTemp.increase).to.be.equal(0);
      expect(carInsurance.totalTemp.decrement).to.be.equal(0);
    });
  });

  describe('#evaluateRuleConditional', () => {
    it('returns the evaluated temporary values', () => {
      const product = new Product('Medium Coverage', 0, 0);
      carInsurance.calculateInsurancePrice(product, rules.any);

      expect(carInsurance.totalTemp.increase).to.be.equal(0);
      expect(carInsurance.totalTemp.decrement).to.be.equal(1);
    });
  });

  describe('#calculateInsurancePrice', () => {
    it('returns error when not finding the insurance hasDynamicSaleDateAndPrice', () => {
      expect(() => {
        carInsurance.calculateInsurancePrice({}, {});
      }).to.throw();
    });

    it('returns error when not finding the insurance rules', () => {
      expect(() => {
        carInsurance.calculateInsurancePrice({}, { hasDynamicSaleDateAndPrice: true });
      }).to.throw();
    });

    it('returns new insurance price', () => {
      const product = new Product('Medium Coverage', 10, 20);
      const newPrice = carInsurance.calculateInsurancePrice(product, rules.any);
      expect(newPrice).to.be.equal(19);
    });
  });

  describe('#verifyInsurance', () => {
    it('returns decremented insurance price', () => {
      const product = new Product('Medium Coverage', 10, 20);
      carInsurance.verifyInsurance(product);
      expect(product.getPrice()).to.be.equal(19);
    });

    it('returns the insurance price without modifications', () => {
      const product = new Product('Mega Coverage', 10, 80);
      carInsurance.verifyInsurance(product);
      expect(product.getPrice()).to.be.equal(80);
    });
  });

  describe('#updatePrice', () => {
    it('return products with the corresponding prices', () => {
      const productsAtDayZero = [
        new Product('Medium Coverage', 10, 20),
        new Product('Full Coverage', 2, 0),
        new Product('Mega Coverage', 0, 80),
      ];

      const carInsurance = new CarInsurance(productsAtDayZero, rules);
      const products = carInsurance.updatePrice();

      expect(products[0].getPrice()).to.be.equal(19);
      expect(products[1].getPrice()).to.be.equal(1);
      expect(products[2].getPrice()).to.be.equal(80);
    });
  });
});
