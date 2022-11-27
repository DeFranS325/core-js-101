/* ************************************************************************************************
 *                                                                                                *
 * Please read the following tutorial before implementing tasks:                                   *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object        *
 *                                                                                                *
 ************************************************************************************************ */


/**
 * Returns the rectangle object with width and height parameters and getArea() method
 *
 * @param {number} width
 * @param {number} height
 * @return {Object}
 *
 * @example
 *    const r = new Rectangle(10,20);
 *    console.log(r.width);       // => 10
 *    console.log(r.height);      // => 20
 *    console.log(r.getArea());   // => 200
 */
function Rectangle(width, height) {
  const obj = {
    width,
    height,
    getArea() {
      return this.width * this.height;
    },
  };

  return obj;
}


/**
 * Returns the JSON representation of specified object
 *
 * @param {object} obj
 * @return {string}
 *
 * @example
 *    [1,2,3]   =>  '[1,2,3]'
 *    { width: 10, height : 20 } => '{"height":10,"width":20}'
 */
function getJSON(obj) {
  return JSON.stringify(obj);
}


/**
 * Returns the object of specified type from JSON representation
 *
 * @param {Object} proto
 * @param {string} json
 * @return {object}
 *
 * @example
 *    const r = fromJSON(Circle.prototype, '{"radius":10}');
 *
 */
function fromJSON(proto, json) {
  const obj = JSON.parse(json);
  const values = Object.values(obj);
  return new proto.constructor(...values);
}


/**
 * Css selectors builder
 *
 * Each complex selector can consists of type, id, class, attribute, pseudo-class
 * and pseudo-element selectors:
 *
 *    element#id.class[attr]:pseudoClass::pseudoElement
 *              \----/\----/\----------/
 *              Can be several occurrences
 *
 * All types of selectors can be combined using the combination ' ','+','~','>' .
 *
 * The task is to design a single class, independent classes or classes hierarchy
 * and implement the functionality to build the css selectors using the provided cssSelectorBuilder.
 * Each selector should have the stringify() method to output the string representation
 * according to css specification.
 *
 * Provided cssSelectorBuilder should be used as facade only to create your own classes,
 * for example the first method of cssSelectorBuilder can be like this:
 *   element: function(value) {
 *       return new MySuperBaseElementSelector(...)...
 *   },
 *
 * The design of class(es) is totally up to you, but try to make it as simple,
 * clear and readable as possible.
 *
 * @example
 *
 *  const builder = cssSelectorBuilder;
 *
 *  builder.id('main').class('container').class('editable').stringify()
 *    => '#main.container.editable'
 *
 *  builder.element('a').attr('href$=".png"').pseudoClass('focus').stringify()
 *    => 'a[href$=".png"]:focus'
 *
 *  builder.combine(
 *      builder.element('div').id('main').class('container').class('draggable'),
 *      '+',
 *      builder.combine(
 *          builder.element('table').id('data'),
 *          '~',
 *           builder.combine(
 *               builder.element('tr').pseudoClass('nth-of-type(even)'),
 *               ' ',
 *               builder.element('td').pseudoClass('nth-of-type(even)')
 *           )
 *      )
 *  ).stringify()
 *    => 'div#main.container.draggable + table#data ~ tr:nth-of-type(even)   td:nth-of-type(even)'
 *
 *  For more examples see unit tests.
 */

const cssSelectorBuilder = {
  cssCode: '',
  lastSelector: '',
  correctOrder: ['element', 'id', 'class', 'attr', 'pseudoClass', 'pseudoElement'],
  lastOrder: -1,

  getLastElemError(selector) {
    if (((selector === 'id') && (selector === this.lastSelector))
        || ((selector === 'element') && (selector === this.lastSelector))
        || ((selector === 'pseudoElement') && (selector === this.lastSelector))) {
      return true;
    }
    return false;
  },

  // if (false) - incorrect order selectors
  incorrectOrder(selector) {
    if ((this.lastOrder !== -1)
      && (this.correctOrder.indexOf(selector) < this.lastOrder)) {
      return true;
    }
    return false;
  },

  copyBuilder(value, selector) {
    const copiesSelectorBuilder = Object.create(this);

    if (copiesSelectorBuilder.getLastElemError(selector)) {
      throw new Error('Element, id and pseudo-element should not occur more then one time inside the selectord');
    }
    if (copiesSelectorBuilder.incorrectOrder(selector)) {
      throw new Error('Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element');
    }
    copiesSelectorBuilder.lastOrder = copiesSelectorBuilder.correctOrder.indexOf(selector);
    copiesSelectorBuilder.lastSelector = selector;
    copiesSelectorBuilder.cssCode += value;
    return copiesSelectorBuilder;
  },

  stringify() {
    const copiesCSSCode = this.cssCode;
    this.cssCode = '';
    this.lastOrder = -1;
    this.lastSelector = '';
    return copiesCSSCode;
  },

  element(value) {
    return this.copyBuilder(`${value}`, 'element');
  },

  id(value) {
    return this.copyBuilder(`#${value}`, 'id');
  },

  class(value) {
    return this.copyBuilder(`.${value}`, 'class');
  },

  attr(value) {
    return this.copyBuilder(`[${value}]`, 'attr');
  },

  pseudoClass(value) {
    return this.copyBuilder(`:${value}`, 'pseudoClass');
  },

  pseudoElement(value) {
    return this.copyBuilder(`::${value}`, 'pseudoElement');
  },

  combine(selector1, combinator, selector2) {
    const sel1 = selector1.stringify();
    const sel2 = selector2.stringify();

    return this.copyBuilder(`${sel1} ${combinator} ${sel2}`, '');
  },
};


module.exports = {
  Rectangle,
  getJSON,
  fromJSON,
  cssSelectorBuilder,
};
