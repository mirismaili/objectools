/**
 * Created on 1401/6/11 (2022/9/2).
 * @author {@link https://mirismaili.github.io S. Mahdi Mir-Ismaili}
 */

export class O<Obj extends object, K extends Key = keyof Obj, V = Obj[keyof Obj]> {
  entries: [K, V][]

  constructor(object: Obj) {
    // @ts-expect-error
    this.entries = Object.entries(object)
  }

  get o() {
    return Object.fromEntries(this.entries) as Obj
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

  static oFromKeys<K extends Key, V>(keys: K[], value: V | ((key: K, index: number) => V)) {
    const instance = Object.create(this.prototype) as O<{[P in K]: V}>
    instance.entries =
      typeof value === 'function'
        ? keys.map((key, index) => [key, (value as (key: K, index: number) => V)(key, index)])
        : keys.map((key) => [key, value])
    return instance
  }

  static fromKeys<V, K extends Key = string>(keys: K[], value: V | ((key: K, index: number) => V)) {
    return this.oFromKeys(keys, value).o
  }

  /**
   * Filter the object by keys and values (chainable).
   * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter
   */
  oFilter<P extends K, U extends V>(
    predicate: (value: V, key: K, index: number) => this is O<{[K in P]: U}>,
  ): O<{[K in P]: U}>
  oFilter<P extends K = never, U extends V = never>(
    predicate: (value: V, key: K, index: number) => unknown,
  ): O<{[K in P]: U}>
  oFilter<P extends K, U extends V>(predicate: (value: V, key: K, index: number) => this is O<{[K in P]: U}>) {
    this.entries = this.entries.filter(([k, v], i) => predicate(v, k, i))
    return this as unknown as O<{[K in P]: U}>
  }

  filter<P extends K, U extends V>(
    predicate: (value: V, key: K, index: number) => this is O<{[K in P]: U}>,
  ): {[K in P]: U}
  filter<P extends K = never, U extends V = never>(
    predicate: (value: V, key: K, index: number) => unknown,
  ): {[K in P]: U}
  /**
   * Filter the object by keys and values.
   * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter
   */
  filter<P extends K, U extends V>(predicate: (value: V, key: K, index: number) => this is O<{[K in P]: U}>) {
    return this.oFilter<P, U>(predicate).o
  }

  /**
   * Map the object by keys and values (chainable).
   * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map
   */
  oMap<P extends Key = K, U = V>(mapper: (value: V, key: K, index: number) => U) {
    if (!this.entries.length) return this as unknown as O<{[K in P]: U}> // @ts-expect-error
    this.entries = this.entries.map(([k, v], i) => [k, mapper(v, k, i)])
    return this as unknown as O<{[K in P]: U}>
  }
  /**
   * Map the object by keys and values.
   * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map
   */
  map<P extends Key = K, U = V>(mapper: (value: V, key: K, index: number) => U) {
    return this.oMap<P, U>(mapper).o
  }

  /**
   * Map the object by keys and values (chainable).
   * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map
   */
  oMapKeyValue<P extends Key = K, U = V>(mapper: (value: V, key: K, index: number) => [P, U]) {
    if (!this.entries.length) return this as unknown as O<{[K in P]: U}> // @ts-expect-error
    this.entries = this.entries.map(([k, v], i) => mapper(v, k, i))
    return this as unknown as O<{[K in P]: U}>
  }
  /**
   * Map the object by keys and values.
   * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map
   */
  mapKeyValue<P extends Key = K, U = V>(mapper: (value: V, key: K, index: number) => [P, U]) {
    return this.oMapKeyValue<P, U>(mapper).o
  }

  /**
   * `forEach`-loop method for objects.
   * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach
   */
  forEach(callback: (value: V, key: K, index: number) => void) {
    this.entries.forEach(([k, v], i) => {
      callback(v, k, i)
    })
  }

  /**
   * `some` method for objects.
   * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/some
   */
  some(predicate: (value: V, key: K, index: number) => unknown): boolean {
    return this.entries.some(([k, v], i) => predicate(v, k, i))
  }
  /**
   * `every` method for objects.
   * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/every
   */
  every(predicate: (value: V, key: K, index: number) => unknown): boolean {
    return this.entries.every(([k, v], i) => predicate(v, k, i))
  }

  /**
   * `indexOf` method for objects.
   * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/indexOf
   */
  indexOf(value: V) {
    return this.entries.findIndex(([_, v]) => v === value)
  }
  indexOfKey(key: K) {
    return this.entries.findIndex(([k]) => k === key)
  }
  /**
   * `lastIndexOf` method for objects.
   * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/lastIndexOf
   */
  lastIndexOf(value: V) {
    return this.entries.findLastIndex(([_, v]) => v === value)
  }

  find<P extends K, U extends V>(
    predicate: (value: V, key: K, index: number) => this is O<{[K in P]: U}>,
  ): [P, U] | undefined
  find(predicate: (value: V, key: K, index: number) => unknown): [K, V] | undefined
  /**
   * Find matched entry (`[key, value]`) in the object.
   * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/find
   */
  find<P extends K, U extends V>(predicate: (value: V, key: K, index: number) => this is O<{[K in P]: U}>) {
    const found = this.entries.find(([k, v], i) => predicate(v, k, i))
    return found && ([found[0] as P, found[1] as U] as const)
  }

  /**
   * Find matched index in the object.
   * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/findIndex
   */
  findIndex(predicate: (value: V, key: K, index: number) => unknown) {
    return this.entries.findIndex(([k, v], i) => predicate(v, k, i))
  }

  findKey<P extends K, U extends V>(
    predicate: (value: V, key: K, index: number) => this is O<{[K in P]: U}>,
  ): P | undefined
  findKey(predicate: (value: V, key: K, index: number) => unknown): K | undefined
  /**
   * Find matched index in the object.
   * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/findIndex
   */
  findKey<P extends K, U extends V>(predicate: (value: V, key: K, index: number) => this is O<{[K in P]: U}>) {
    return this.entries.find(([k, v], i) => predicate(v, k, i))?.[0]
  }

  findValue<P extends K, U extends V>(
    predicate: (value: V, key: K, index: number) => this is O<{[K in P]: U}>,
  ): U | undefined
  findValue(predicate: (value: V, key: K, index: number) => unknown): V | undefined
  /**
   * Similar to `find()` method. But returns only the `value` (instead of `[key, value]`).
   * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/find
   */
  findValue<P extends K, U extends V>(predicate: (value: V, key: K, index: number) => this is O<{[K in P]: U}>) {
    return this.entries.find(([k, v], i) => predicate(v, k, i))?.[1]
  }

  findLast<P extends K, U extends V>(
    predicate: (value: V, key: K, index: number) => this is O<{[K in P]: U}>,
  ): [P, U] | undefined
  findLast(predicate: (value: V, key: K, index: number) => unknown): [K, V] | undefined
  /**
   * Find the last matched entry (`[key, value]`) in the object.
   * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/findLast
   */
  findLast<P extends K, U extends V>(predicate: (value: V, key: K, index: number) => this is O<{[K in P]: U}>) {
    const found = this.entries.findLast(([k, v], i) => predicate(v, k, i))
    return found && ([found[0] as P, found[1] as U] as const)
  }

  /**
   * Find the last matched index in the object.
   * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/findLastIndex
   */
  findLastIndex(predicate: (value: V, key: K, index: number) => unknown) {
    return this.entries.findLastIndex(([k, v], i) => predicate(v, k, i))
  }

  findLastKey<P extends K, U extends V>(
    predicate: (value: V, key: K, index: number) => this is O<{[K in P]: U}>,
  ): P | undefined
  findLastKey(predicate: (value: V, key: K, index: number) => unknown): K | undefined
  /**
   * Find the last matched key in the object.
   * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/findLastIndex
   */
  findLastKey<P extends K, U extends V>(predicate: (value: V, key: K, index: number) => this is O<{[K in P]: U}>) {
    return this.entries.findLast(([k, v], i) => predicate(v, k, i))?.[0]
  }

  findLastValue<P extends K, U extends V>(
    predicate: (value: V, key: K, index: number) => this is O<{[K in P]: U}>,
  ): U | undefined
  findLastValue(predicate: (value: V, key: K, index: number) => unknown): V | undefined
  /**
   * Similar to `findLast()` method. But returns only the `value` (instead of `[key, value]`).
   * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/findLast
   */
  findLastValue<P extends K, U extends V>(predicate: (value: V, key: K, index: number) => this is O<{[K in P]: U}>) {
    return this.entries.findLast(([k, v], i) => predicate(v, k, i))?.[1]
  }

  /**
   * NOT [IN-PLACE](https://en.wikipedia.org/wiki/In-place_algorithm) sort the object by keys and values (and return a
   * NEW object) (chainable).
   * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/toSorted
   */
  oSort(compareFn: (a: [K, V], b: [K, V]) => number = ([key1], [key2]) => (String(key1) < String(key2) ? -1 : 1)) {
    this.entries.sort(compareFn)
    return this
  }
  /**
   * NOT [IN-PLACE](https://en.wikipedia.org/wiki/In-place_algorithm) sort the object by keys and values (and return a
   * NEW object).
   * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/toSorted
   */
  sort(compareFn?: (a: [K, V], b: [K, V]) => number) {
    return this.oSort(compareFn).o
  }

  /** Filter out given key(s) from the object. */
  omit<P extends K>(...keys: P[]) {
    const obj = this.o
    const newKeys = new Set(Object.keys(this.o)) as Set<Exclude<K, P>>
    for (const key of keys) newKeys.delete(key as unknown as Exclude<K, P>)
    const newObj = {} as {[Q in Exclude<K, P>]: V}
    for (const key of newKeys) newObj[key] = obj[key as unknown as keyof Obj] as V
    return newObj
    // return this.oOmit<P>(...keys).o
  }
  /** Filter out given key(s) from the object. (chainable) */
  oOmit<P extends K>(...keys: P[]) {
    return o(this.omit<P>(...keys))
    // this.entries = this.entries.filter(([k]) => !keys.includes(k as P))
    // return this as unknown as O<Exclude<K, P>, V>
  }

  /**
   * Similar to `oSort()` method. But operates based on the `value`s only (instead of `[key, value]`s).
   * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/toSorted
   */
  oSortByValues(compareFn: (v1: V, v2: V) => number = (v1, v2) => (v1 < v2 ? -1 : 1)) {
    this.entries.sort(([_, v1], [__, v2]) => compareFn(v1, v2))
    return this
  }
  /**
   * Similar to `sort()` method. But operates based on the `value`s only (instead of `[key, value]`s).
   * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/toSorted
   */
  sortByValues(compareFn?: (v1: V, v2: V) => number) {
    return this.oSortByValues(compareFn).o
  }

  shallowEqual(object: Record<K, any>) {
    const values = Object.values(object)
    return this.entries.length === values.length && this.entries.every(([, v], i) => v === values[i])
  }

  /**
   * Swap (mirror) key-value pairs.
   * @example
   * {a: 'x', b: 'y'} --> {x: 'a', y: 'b'}
   */
  oFlip() {
    // @ts-expect-error
    this.entries = this.entries.map(([k, v]) => [v, k])
    return this as unknown as O<{[K in V extends Key ? V : never]: K}>
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
   * NOT [IN-PLACE](https://en.wikipedia.org/wiki/In-place_algorithm) reverse the object (and return a NEW object)
   * (chainable).
   * @example
   * {a: 'x', b: 'y'} --> {b: 'y', a: 'x'}
   * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/toReversed
   */
  oReverse() {
    this.entries.reverse()
    return this
  }
  /**
   * NOT [IN-PLACE](https://en.wikipedia.org/wiki/In-place_algorithm) reverse the object (and return a NEW object).
   * @example
   * {a: 'b', c: 'd'} --> {b: 'y', a: 'x'}
   * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/toReversed
   */
  reverse() {
    return this.oReverse().o
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
    return this as unknown as O<{[VK in V extends object ? keyof V : never]: {[P in K]: V[keyof V]}}>
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
const o = <Obj extends object, K extends Key = keyof Obj, V = Obj[keyof Obj]>(object: Obj) => new O<Obj, K, V>(object)
export default o

type Key = keyof any

const obj = {a: 1, b: 2, c: 3}
o(obj).filter((value) => value > 1)
