/**
 * Created on 1401/6/11 (2022/9/2).
 * @author {@link https://mirismaili.github.io S. Mahdi Mir-Ismaili}
 */

export class O<V, K extends keyof any> {
  entries: [K, V][]

  constructor(object: {[P in K]: V}) {
    // @ts-expect-error
    this.entries = Object.entries(object)
  }

  get o() {
    return Object.fromEntries(this.entries) as {[P in K]: V}
  }

  get keys() {
    return new Set(this.entries.map(([key]) => key))
  }

  get values() {
    return this.entries.map(([, value]) => value)
  }

  get length() {
    return this.entries.length
  }

  static oFromKeys<V, K extends string = string>(keys: K[], value: V | ((key: K, index: number) => V)) {
    const instance = Object.create(this.prototype) as O<V, K>
    instance.entries =
      typeof value === 'function'
        ? keys.map((key, index) => [key, (value as (key: string, index: number) => V)(key, index)])
        : keys.map((key) => [key, value])
    return instance
  }

  static fromKeys<V, K extends string = string>(keys: K[], value: V | ((key: K, index: number) => V)) {
    return this.oFromKeys(keys, value).o
  }

  oFilter<U extends V, P extends K>(predicateFn: (value: V, key: K, index: number) => this is O<U, P>) {
    this.entries = this.entries.filter(([k, v], i) => predicateFn(v, k, i))
    return this as unknown as O<U, P>
  }

  filter<U extends V, P extends K>(predicateFn: (value: V, key: K, index: number) => this is O<U, P>) {
    return this.oFilter<U, P>(predicateFn).o
  }

  oMap<U, P extends keyof any>(mapper: (value: V, key: K, index: number) => U | [P, U]) {
    if (!this.entries.length) return this as unknown as O<U, P>

    const [firstKey, firstValue] = this.entries[0]
    const testReturnType = mapper(firstValue, firstKey, 0)

    // @ts-expect-error
    this.entries =
      testReturnType instanceof Array &&
      testReturnType.length === 2 &&
      ['string', 'number', 'symbol'].includes(typeof testReturnType[0])
        ? this.entries.map(([k, v], i) => mapper(v, k, i))
        : this.entries.map(([k, v], i) => [k, mapper(v, k, i)])

    return this as unknown as O<U, P>
  }

  map<U, P extends keyof any>(mapper: (value: V, key: K, index: number) => U | [P, U]) {
    return this.oMap<U, P>(mapper).o
  }

  forEach(callback: (value: V, key: K, index: number) => void) {
    this.entries.forEach(([k, v], i) => {
      callback(v, k, i)
    })
  }

  some(predicateFn: (value: V, key: K, index: number) => unknown): boolean {
    return this.entries.some(([k, v], i) => predicateFn(v, k, i))
  }

  every(predicateFn: (value: V, key: K, index: number) => unknown): boolean {
    return this.entries.every(([k, v], i) => predicateFn(v, k, i))
  }

  indexOf(value: V) {
    return this.entries.findIndex(([_, v]) => v === value)
  }

  indexOfKey(key: K) {
    return this.entries.findIndex(([k]) => k === key)
  }

  lastIndexOf(value: V) {
    return this.entries.findLastIndex(([_, v]) => v === value)
  }

  findIndex<U extends V, P extends K>(predicateFn: (value: V, key: K, index: number) => this is O<U, P>) {
    return this.entries.findIndex(([k, v], i) => predicateFn(v, k, i))
  }

  findLastIndex<U extends V, P extends K>(predicateFn: (value: V, key: K, index: number) => this is O<U, P>) {
    return this.entries.findLastIndex(([k, v], i) => predicateFn(v, k, i))
  }

  find<U extends V, P extends K>(predicateFn: (value: V, key: K, index: number) => this is O<U, P>) {
    const found = this.entries.find(([k, v], i) => predicateFn(v, k, i))
    return found && ([found[0] as P, found[1] as U] as const)
  }

  findLast<U extends V, P extends K>(predicateFn: (value: V, key: K, index: number) => this is O<U, P>) {
    const found = this.entries.findLast(([k, v], i) => predicateFn(v, k, i))
    return found && ([found[0] as P, found[1] as U] as const)
  }

  oSort(compareFn: (a: [K, V], b: [K, V]) => number = sortByKeys) {
    this.entries.sort(compareFn)
    return this
  }

  sort(compareFn: (a: [K, V], b: [K, V]) => number = sortByKeys) {
    return this.oSort(compareFn).o
  }

  shallowEqual(object: Record<K, any>) {
    const values = Object.values(object)
    return this.entries.length === values.length && this.entries.every(([, v], i) => v === values[i])
  }

  /**
   * Swap (mirror) key-value pairs.
   * @example
   * {a: 'b', c: 'd'} --> {b: 'a', d: 'c'}
   */
  oFlip() {
    // @ts-expect-error
    this.entries = this.entries.map(([k, v]) => [v, k])
    return this as unknown as O<K, V extends string ? V : never>
  }

  /**
   * Swap (mirror) key-value pairs.
   * @example
   * {a: 'x', b: 'y'} --> {x: 'a', y: 'b'}
   */
  flip() {
    return this.oFlip().o
  }

  /**
   * **`O.fromKeys(o(this.values[0]).keys, k1 => O.fromKeys(this.keys, k2 => this.o[k2][k1]))`**
   * <br> *(except error handling, etc.)*
   * @example
   * {
   *   x: {a: 1, b: 2},
   *   y: {a: 3, b: 4},
   *   z: {a: 5, b: 6},
   * } --> {
   *   a: {x: 1, y: 3, z: 5},
   *   b: {x: 2, y: 4, z: 6},
   * }
   */
  oTranspose() {
    const firstEntry = this.entries[0]
    if (!firstEntry) return this

    // @ts-expect-error
    this.entries = Object.keys(firstEntry[1]).map((key1) => [
      key1,
      Object.fromEntries(
        this.entries.map(([key2, value2]) => [
          key2, // The magic:
          // @ts-expect-error
          value2[key1], // === `this.o[key2][key1]` (Swap `key1` and `key2`)!
        ]),
      ),
    ])
    return this as unknown as O<Record<K, any>, V extends object ? keyof V : never>
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
   */
  transpose() {
    return this.oTranspose().o
  }
}

/**
 * Provide (chainable) useful utilities (`map`, `filter`, ...) for javascript **`Object`**s (like **`Array`**s).
 * @example
 * // Map values (and/or keys):
 * const newObject = o(myObject).map(...) // => an `Object`
 * // Chain methods (`map` then `filter`):
 * const anotherObject = o(myObject).oMap(...).filter(...) // => an `Object`
 * // Filter then access keys/values:
 * const filteredKeys = o(myObject).oFilter(...).keys // or `.values` // => an `Array`
 * // Access `length`:
 * const length = o(myObject).length // => a `number`
 */
const o = <V, K extends string>(object: {[P in K]: V}) => object && new O(object)
// noinspection JSUnusedGlobalSymbols
export default o

const sortByKeys = <K extends keyof any>([key1]: [K, any], [key2]: [K, any]) => (String(key1) < String(key2) ? -1 : 1)
