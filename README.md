# ObjecTools

> Useful easy-to-use utilities to for javascript objects

[![npm (scoped)](https://img.shields.io/npm/v/objectools.svg)](https://npmjs.com/package/objectools)
[![install size](https://packagephobia.now.sh/badge?p=objectools)](https://packagephobia.now.sh/result?p=objectools)
[![downloads](https://img.shields.io/npm/dt/objectools.svg)](https://npmjs.com/package/objectools) <br>
[![license](https://img.shields.io/github/license/mirismaili/objectools.svg)](https://github.com/mirismaili/objectools/blob/master/LICENSE)
[![Forks](https://img.shields.io/github/forks/mirismaili/objectools.svg?style=social)](https://github.com/mirismaili/objectools/fork)
[![Stars](https://img.shields.io/github/stars/mirismaili/objectools.svg?style=social)](https://github.com/mirismaili/objectools)

## Features

- **Easy to use**, w/o
  modifying [object prototype](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Objects/Object_prototypes) (`o(obj).filter(...)`)
- Useful methods that are operable on **keys**, **values** and **indices** (see [Example usages](#example-usages)):
  - `filter()`
  - `map()`, `forEach()`
  - `find()`, `findIndex()`, `findLast()`, `findLastIndex()`
  - `indexOf()`, `lastIndexOf()`, `indexOfKey()`
  - `some()`, `every()`
  - `sort()`
  - `flip()`, `transpose()`
- and properties:
  - `.length`
  - `.keys`, `.values`, `.entries`
- Provide an easy way to **chain methods** (see [Example usages](#example-usages))
- **Typed keys and values**
- **No dependency**, based on modern JS features
- Memory and processor efficient
- Returns [`Set`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set) instead
  of [`Array`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) for `.keys` (
  see: [_Why does `Object.keys()` return an `Array` instead of
  a `Set`?_](https://esdiscuss.org/topic/why-does-object-keys-return-an-array-instead-of-a-set))

## Installation

```bash
npm i objectools
```

or:

```bash
yarn add objectools
```

## Example usages:

```ts
import o from 'objectools'

const obj = {a: 1, b: 2, c: 3}

o(obj).filter((value) => value > 1) // {b: 2, c: 3}
o(obj).filter((_, key, index) => key < 'c' && index > 0) // {b: 2}

o(obj).map((value) => value * 2) // {a: 2, b: 4, c: 6}
o(obj).map((value, key) => [key.toUpperCase(), value - 1]) // {A: 0, B: 1, C: 2}

o(obj).keys // Set {'a', 'b', 'c'} // Type: `Set<'a' | 'b' | 'c'>`
o(obj).values // [1, 2, 3] // Type: `number[]`
o(obj).entries // [['a', 1], ['b', 2], ['c', 3]] // Type: ['a' | 'b' | 'c', number][]
o(obj).length // 3

o(obj).find((value) => value > 1) // ['b', 2]
o(obj).findIndex((value) => value > 1) // 1
o(obj).findLast((value) => value > 1) // ['c', 3]
o(obj).findLastIndex((value) => value > 1) // 2

o({a: 3, b: 3}).indexOf(3) // 0
o({a: 3, b: 3}).lastIndexOf(3) // 1
o({a: 3, b: 3}).indexOfKey('b') // 1

o(obj).some((value) => value > 1) // true
o(obj).every((value) => value > 1) // false

o({a: 'x', b: 'y'}).flip() // {x: 'a', y: 'b'}

// Chain methods:
o({b: 1, a: 2, c: 3})
  .oFilter((value) => value < 3)
  .oMap((value) => value * 2)
  .sort()
// --> {a: 4, b: 2}

o({
  x: {a: 1, b: 2},
  y: {a: 3, b: 4},
  z: {a: 5, b: 6},
}).transpose()
// Returns:
// {
//   a: {x: 1, y: 3, z: 5},
//   b: {x: 2, y: 4, z: 6},
// }
```
