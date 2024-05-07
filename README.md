# ObjecTools

> Useful easy-to-use utilities for JavaScript objects

[![npm (scoped)](https://img.shields.io/npm/v/objectools.svg)](https://npmjs.com/package/objectools)
[![install size](https://packagephobia.now.sh/badge?p=objectools)](https://packagephobia.now.sh/result?p=objectools)
[![downloads](https://img.shields.io/npm/dt/objectools.svg)](https://npmjs.com/package/objectools) <br>
[![license](https://img.shields.io/github/license/mirismaili/objectools.svg)](https://github.com/mirismaili/objectools/blob/master/LICENSE)
[![Forks](https://img.shields.io/github/forks/mirismaili/objectools.svg?style=social)](https://github.com/mirismaili/objectools/fork)
[![Stars](https://img.shields.io/github/stars/mirismaili/objectools.svg?style=social)](https://github.com/mirismaili/objectools)

## Table of contents

- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Examples](#examples)
  - [`.filter()`](#filter)
  - [`.map()`](#map)
  - [`.keys`, `.values`, `.entries`, `.length`](#keys-values-entries-length)
  - [`.find()`, `.findIndex()`, `.findKey()`, `.findValue()`](#find-findindex-findkey-findvalue)
  - [`.findLast()`, `.findLastIndex()`, `.findLastKey()`, `.findLastValue()`](#findlast-findlastindex-findlastkey-findlastvalue)
  - [`.indexOf()`, `.lastIndexOf()`, `.indexOfKey()`](#indexof-lastindexof-indexofkey)
  - [`.sort()`, `.sortByValues()`](#sort-sortbyvalues)
  - [`.some()`, `.every()`](#some-every)
  - [`.omit()`](#omit)
  - [`.flip()`](#flip)
  - [`.reverse()`](#reverse)
  - [Chain methods](#chain-methods)
  - [`.transpose()`](#transpose)
- [Usage with Jest](#usage-with-jest)

## Features

- **Easy to use**, w/o
  modifying [object prototype](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Objects/Object_prototypes) (`o(obj).filter(...)`)
- Useful methods that are operable on **keys**, **values** and **indices** (see [Examples](#examples)):
  - [`filter()`](#filter)
  - [`map()`](#map), `forEach()`
  - [`find()`](#find-findindex-findkey-findvalue), [`findIndex()`](#find-findindex-findkey-findvalue), [`findLast()`](#findlast-findlastindex-findlastkey-findlastvalue), [`findLastIndex()`](<(#findlast-findlastindex-findlastkey-findlastvalue)>)
  - [`indexOf()`, `lastIndexOf()`, `indexOfKey()`](<(#indexof-lastindexof-indexofkey)>)
  - [`sort()`](#sort-sortbyvalues),
  - `reverse()`
  - [`some()`](#some-every), [`every()`](#some-every)
  - [`omit() // omit key(s)`](#omit)
  - [`flip()`](#flip), [`transpose()`](#transpose)
- and properties:
  - `.length`
  - `.keys`, `.values`, `.entries`
- Provides an easy way to **[chain methods](#chain-methods)**
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

## Usage

```ts
import o from 'objectools'

o({a: 1, b: 2, c: 3}).filter(/*...*/)
o({a: 1, b: 2, c: 3}).map(/*...*/)
o({a: 1, c: 3, b: 2}).sort()
o({...}) //...

// Or chain methods:
o({...}).oFilter(/*...*/).oMap(/*...*/).sort() // Don't prefix the last one with `o`.
// I.e. don't write `.oSort()` if you don't want to countinue the chain.
```

## Examples

### [`.filter()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter)

```ts
o({a: 1, b: 2, c: 3}).filter((value) => value > 1) // {b: 2, c: 3}
o({a: 1, b: 2, c: 3}).filter((_, key, index) => key < 'c' && index > 0) // {b: 2}
```

### [`.map()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map)

```ts
o({a: 1, b: 2, c: 3}).map((value) => value * 2) // {a: 2, b: 4, c: 6}
o({a: 1, b: 2, c: 3}).map((value, key) => [key.toUpperCase(), value - 1]) // {A: 0, B: 1, C: 2}
```

### `.keys`, `.values`, `.entries`, `.length`

```ts
o({a: 1, b: 2, c: 3}).keys // Set {'a', 'b', 'c'} // Type: `Set<'a' | 'b' | 'c'>`
o({a: 1, b: 2, c: 3}).values // [1, 2, 3] // Type: `number[]`
o({a: 1, b: 2, c: 3}).entries // [['a', 1], ['b', 2], ['c', 3]] // Type: ['a' | 'b' | 'c', number][]
o({a: 1, b: 2, c: 3}).length // 3
```

### [`.find()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/find), [`.findIndex()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/findIndex), `.findKey()`, `.findValue()`

```ts
o({a: 1, b: 2, c: 3}).find((value) => value > 1) // ['b', 2]
o({a: 1, b: 2, c: 3}).findIndex((value) => value > 1) // 1
o({a: 1, b: 2, c: 3}).findKey((value) => value > 1) // 'b'
o({a: 1, b: 2, c: 3}).findValue((value) => value > 1) // 2
```

### [`.findLast()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/findLast), [`.findLastIndex()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/findLastIndex), `.findLastKey()`, `.findLastValue()`

```ts
o({a: 1, b: 2, c: 3}).findLast((value) => value > 1) // ['c', 3]
o({a: 1, b: 2, c: 3}).findLastIndex((value) => value > 1) // 2
o({a: 1, b: 2, c: 3}).findLastKey((value) => value > 1) // 'c'
o({a: 1, b: 2, c: 3}).findLastValue((value) => value > 1) // 3
```

### [`.indexOf()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/indexOf), [`.lastIndexOf()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/lastIndexOf), `.indexOfKey()`

```ts
o({a: 3, b: 3}).indexOf(3) // 0
o({a: 3, b: 3}).lastIndexOf(3) // 1
o({a: 3, b: 3}).indexOfKey('b') // 1
```

### [`.sort()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/toSorted), `.sortByValues()`

```ts
o({b: 1, a: 3, c: 2}).sort() // {a: 3, b: 1, c: 2}
o({b: 1, a: 3, c: 2}).sortByValues() // {b: 1, c: 2, a: 3}
```

### [`.some()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/some), [`.every()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/every)

```ts
o({a: 1, b: 2, c: 3}).some((value) => value > 1) // true
o({a: 1, b: 2, c: 3}).every((value) => value > 1) // false
```

### `.omit()`

```ts
o({a: 1, b: 2, c: 3}).omit('b') // {a: 1, c: 3}
o({a: 1, b: 2, c: 3}).omit('c', 'a') // {b: 2}
```

### `.flip()`

```ts
o({a: 'x', b: 'y'}).flip() // {x: 'a', y: 'b'}
```

### [`.reverse()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reverse)

```ts
o({a: 'x', b: 'y'}).reverse() // {b: 'y', a: 'x'}
```

### Chain methods

```ts
o({b: 1, a: 2, c: 3})
  .oFilter((value) => value < 3)
  .oMap((value) => value * 2)
  .sort()
// --> {a: 4, b: 2}
```

### `.transpose()`

```ts
o({
  x: {a: 1, b: 2},
  y: {a: 3, b: 4},
  z: {a: 5, b: 6},
}).transpose()
// -->
// {
//   a: {x: 1, y: 3, z: 5},
//   b: {x: 2, y: 4, z: 6},
// }
```

## Usage with [Jest](https://jestjs.io/)

You may need to add this to your [_"jest.config.js"_](https://jestjs.io/docs/configuration) file:

```js
export default {
  transformIgnorePatterns: [
    // These packages are created based on modern javascript and use ESM module system (import/export). But Jest use
    // old common-js module-system. So we need to transform these files using babel, too (like source files). Note that
    // "node_modules" folder is ignored by default, and we've EXCLUDED these packages from this general rule (see `?!`
    // in the below regex).
    '/node_modules/(?!(objectools)/)',
}
```

<sup>_See: https://stackoverflow.com/a/49676319/5318303/#jest-gives-an-error-syntaxerror-unexpected-token-export_ </sup>
