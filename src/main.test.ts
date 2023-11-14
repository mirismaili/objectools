import {expect, test} from 'bun:test'
import o from './main'

const obj = {a: 1, b: 2, c: 3}
const obj2 = {a: 3, b: 3}

test('.filter()', () => {
  expect(o(obj).filter((value) => value > 1)).toEqual({b: 2, c: 3})
  expect(o(obj).filter((_, key, index) => key < 'c' && index > 0)).toEqual({b: 2})
})

test('.map()', () => {
  expect(o(obj).map((value) => value * 2)).toEqual({a: 2, b: 4, c: 6})
  expect(o(obj).map((value, key) => [key.toUpperCase(), value - 1])).toEqual({A: 0, B: 1, C: 2})
})

test('.keys, .values, .entries, .length', () => {
  expect(o(obj).keys).toEqual(new Set(['a', 'b', 'c'])) // Type: `Set<'a' | 'b' | 'c'>`
  expect(o(obj).values).toEqual([1, 2, 3])
  expect(o(obj).entries).toEqual([
    ['a', 1],
    ['b', 2],
    ['c', 3],
  ])
  expect(o(obj).length).toBe(3)
})

test('.find(), .findIndex(), .findKey(), .findValue()', () => {
  expect(o(obj).find((value) => value > 1)).toEqual(['b', 2])
  expect(o(obj).findIndex((value) => value > 1)).toBe(1)
  expect(o(obj).findKey((value) => value > 1)).toBe('b')
  expect(o(obj).findValue((value) => value > 1)).toBe(2)
})

test('.findLast(), .findLastIndex(), .findLastKey(), .findLastValue()', () => {
  expect(o(obj).findLast((value) => value > 1)).toEqual(['c', 3])
  expect(o(obj).findLastIndex((value) => value > 1)).toBe(2)
  expect(o(obj).findLastKey((value) => value > 1)).toBe('c')
  expect(o(obj).findLastValue((value) => value > 1)).toBe(3)
})

test('.indexOf(), .lastIndexOf(), .indexOfKey()', () => {
  expect(o(obj2).indexOf(3)).toBe(0)
  expect(o(obj2).lastIndexOf(3)).toBe(1)
  expect(o(obj2).indexOfKey('b')).toBe(1)
})

test('.some(), .every()', () => {
  expect(o(obj).some((value) => value > 1)).toBeTrue()
  expect(o(obj).every((value) => value > 1)).toBeFalse()
})

test('.sort(), .sortByValues()', () => {
  expect(o({b: 1, a: 3, c: 2}).sort()).toEqual({a: 3, b: 1, c: 2})
  expect(o({b: 1, a: 3, c: 2}).sortByValues()).toEqual({b: 1, c: 2, a: 3})
})

test('.flip()', () => {
  expect(o({a: 'x', b: 'y'}).flip()).toEqual({x: 'a', y: 'b'})
})

test('.reverse()', () => {
  expect(o({a: 'x', b: 'y'}).reverse()).toEqual({b: 'y', a: 'x'})
})

test('Chain methods', () => {
  expect(
    o({b: 1, a: 2, c: 3})
      .oFilter((value) => value < 3)
      .oMap((value) => value * 2)
      .sort(),
  ).toEqual({a: 4, b: 2})
})

test('.transpose()', () => {
  expect(
    o({
      x: {a: 1, b: 2},
      y: {a: 3, b: 4},
      z: {a: 5, b: 6},
    }).transpose(),
  ).toEqual({
    a: {x: 1, y: 3, z: 5},
    b: {x: 2, y: 4, z: 6},
  })
})
