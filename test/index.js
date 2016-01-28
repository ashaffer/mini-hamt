/**
 * Imports
 */

import test from 'tape'
import * as hamt from '../src'
import times from '@f/times'

/**
 * Tests
 */

test('should work', t => {
  const p = hamt.set(hamt.empty, 'test', 1)

  t.equal(hamt.get(p, 'test'), 1)

  const p2 = hamt.set(p, 'test2', 2)

  t.equal(hamt.get(p2, 'test'), 1)
  t.equal(hamt.get(p2, 'test2'), 2)
  t.equal(hamt.get(p, 'test'), 1)
  t.equal(hamt.get(p, 'test2'), undefined)

  const p3 = hamt.del(p2, 'test')

  t.equal(hamt.get(p3, 'test'), undefined)
  t.equal(hamt.get(p3, 'test2'), 2)
  t.equal(hamt.get(p2, 'test'), 1)

  t.end()
})

test('branching', t => {
  // These two keys fall into the same first
  // bucket
  const key1 = '6.3.7'
  const key2 = '5.2.3.0.7.0.8.8.3'

  let p = hamt.set(hamt.empty, key1, 1)

  p = hamt.set(p, key2, 2)

  // This stuff caused issues by random trial and error
  p = hamt.set(p, 'test', 3)
  p = hamt.set(p, '2', 2)

  t.equal(hamt.get(p, key1), 1)
  t.equal(hamt.get(p, key2), 2)

  t.end()
})

test.only('random', t => {
  const strs = times(100, randomString)
  let p = hamt.empty

  times(strs.length, i => p = hamt.set(p, strs[i], 1))
  times(strs.length, i => t.equal(hamt.get(p, strs[i]), 1, strs[i]))

  t.end()
})

/**
 * Helpers
 */

function randomString () {
  var octets = Math.floor(Math.random() * 10)
  var parts = []

  for (var i = 0; i < octets; i++) {
   parts.push(Math.floor(Math.random() * 10))
  }

  return parts.join('.')
}
