/**
 * Created on 1401/6/11 (2022/9/2).
 * @author {@link https://mirismaili.github.io S. Mahdi Mir-Ismaili}
 */

/**
 * @property {Object} o
 */
export class O {
  constructor (object) {
    this.entries = Object.entries(object)
  }
  
  /**
   * @callback MapKeyToValue
   * @param {string} key
   * @param {int} [index]
   */
  /**
   * @param {string[]} keys
   * @param {MapKeyToValue|*} [value]
   * @return {*}
   */
  static fromKeys (keys, value) {
    if (!keys) return keys
    const instance = Object.create(this.prototype)
    instance.entries = typeof value === 'function'
                       ? keys.map((key, index) => [key, value(key, index)])
                       : keys.map((key) => [key, value])
    return instance
  }
  
  get o () {
    return Object.fromEntries(this.entries)
  }
  
  get keys () {
    return [...new Set(this.entries.map(([key]) => key))]
  }
  
  get values () {
    return this.entries.map(([, value]) => value)
  }
  
  get length () {
    return this.entries.length
  }
  
  /**
   * @callback PredicateFn
   * @param {any} value
   * @param {string} [key]
   * @param {int} [index] The index of the current element being processed in the `entries` array
   * @param {[string, *][]} [entries] The entries of the object on which the method was called
   * @return {boolean|any}
   */
  
  /**
   * @param {PredicateFn} predicateFn
   * @param {Object} [thisArg]
   */
  filter (predicateFn, thisArg) {
    this.entries = this.entries.filter(([k, v], i, entries) => predicateFn.call(thisArg, v, k, i, entries))
    return this
  }
  
  /**
   * @callback ValueMapper
   * @param {any} value
   * @param {string} [key]
   * @param {int} [index] The index of the current element being processed in the `entries` array
   * @param {[string, *][]} [entries] The entries of the object on which the method was called
   * @return {*} The new value
   */
  
  /**
   * @callback KeyMapper
   * @param {string} key
   * @param {any} [value]
   * @param {int} [index] The index of the current element being processed in the `entries` array
   * @param {[string, *][]} [entries] The entries of the object on which the method was called
   * @return {string} The new key
   */
  /**
   * @param {ValueMapper} [valueMapper=neutralMapper]
   * @param {KeyMapper} [keyMapper=neutralMapper]
   */
  map (valueMapper = neutralMapper, keyMapper = neutralMapper) {
    this.entries = this.entries.map(([k, v], i, entries) => [
      keyMapper(k, v, i, entries),
      valueMapper(v, k, i, entries),
    ])
    return this
  }
  
  /**
   * @callback ForEachCallback
   * @param {any} value
   * @param {string} [key]
   * @param {int} [index] The index of the current element being processed in the `entries` array
   * @param {[string, *][]} [entries] The entries of the object on which the method was called
   */
  /**
   * @param {ForEachCallback} callback
   */
  forEach (callback) { // noinspection JSCheckFunctionSignatures
    this.entries.forEach(([k, v], i, entries) => {
      callback(v, k, i, entries)
    })
  }
  
  /**
   * @param {ValueMapper} valueMapper
   * @param {KeyMapper} [keyMapper]
   * @param {Object} [options]
   * @param {*[]} [options.filterOn=[undefined]]
   */
  filterMap (valueMapper, keyMapper, {filterOn = [undefined]} = {}) { // noinspection JSValidateTypes
    this.entries = this.entries.reduce((result, [k, v], i, entries) => {
      const mappedValue = valueMapper(v, k, i, entries)
      if (filterOn.includes(mappedValue)) return result
      result.push([
        keyMapper?.(k, v, i, entries) ?? k,
        mappedValue,
      ])
      return result
    }, [])
    return this
  }
  
  /**
   * @param {PredicateFn} predicateFn
   * @param {Object} [thisArg]
   * @return {boolean}
   */
  some (predicateFn, thisArg) {
    return this.entries.some(([k, v], i, entries) => predicateFn.call(thisArg, v, k, i, entries))
  }
  
  /**
   * @param {PredicateFn} predicateFn
   * @param {Object} [thisArg]
   * @return {boolean}
   */
  every (predicateFn, thisArg) {
    return this.entries.every(([k, v], i, entries) => predicateFn.call(thisArg, v, k, i, entries))
  }
  
  /**
   * By default, sorts by keys.
   */
  sort (compareFn = sortByKeys) {
    this.entries.sort(compareFn)
    return this
  }
  
  /**
   * @param {PredicateFn} predicateFn
   * @param {Object} [thisArg]
   * @return {{key:string?,value:*}} The first key/value pair that satisfies the predicate function as `{key: key,
   *   value: value}`. If nothing matched `{key: undefined, value: undefined}` returned.
   */
  find (predicateFn, thisArg) {
    const found = this.entries.find(([k, v], i, entries) => predicateFn.call(thisArg, v, k, i, entries))
    return found ? {key: found[0], value: found[1]} : {key: undefined, value: undefined}
  }
  
  shallowEqual (object) {
    const values = Object.values(object)
    return this.entries.length === values.length && this.entries.every(([, v], i) => v === values[i])
  }
  
  /**
   * Swap key-value pairs
   * @example
   * {a: 'b', c: 'd'} --> {b: 'a', d: 'c'}
   */
  flip () {
    this.entries = this.entries.map(([k, v]) => [v, k])
    return this
  }
  
  /**
   * @example
   * {
   *   x: {a: 1, b: 2},
   *   y: {a: 3, b: 4},
   *   z: {a: 5, b: 6},
   * } --> {
   *   a: {x: 1, y: 3, z: 5},
   *   b: {x: 2, y: 4, z: 6},
   * }
   * @return {O} Transposed object. It's equivalent to return:
   * <br> **`O.fromKeys(o(this.values[0]).keys, k1 => O.fromKeys(this.keys, k2 => this.o[k2][k1]).o).o`**
   * <br> *(except error handling, etc.)*
   */
  transpose () {
    const firstEntry = this.entries[0]
    if (!firstEntry) return this
    
    this.entries = Object.keys(firstEntry[1]).map((key1) => [
      key1,
      Object.fromEntries(this.entries.map(([key2, value2]) => [
        key2, // The magic:
        value2[key1], // === `this.o[key2][key1]` (Swap `key1` and `key2`)!
      ])),
    ])
    return this
  }
}

/**
 * Provide (chainable) useful utilities (`map`, `filter`, ...) for javascript **`Object`**s (like **`Array`**s).
 * @example
 * // Map values (and/or keys):
 * const newObject = o(myObject).map(...).o // => an `Object`
 * // Chain methods (`map` then `filter`):
 * const anotherObject = o(myObject).map(...).filter(...).o // => an `Object`
 * // Filter then access keys/values:
 * const filteredKeys = o(myObject).filter(...).keys // or `.values` // => an `Array`
 * // Access `length`:
 * const length = o(myObject).length // => a `number`
 */
const o = (object) => object && new O(object)
export default o

const sortByKeys = ([key1], [key2]) => key1 < key2 ? -1 : 1

const neutralMapper = x => x
