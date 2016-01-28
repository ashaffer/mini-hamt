var hamt = require('.')

// Crude benchmarks for now
var n = 5000
var strs = []

for (var i = 0; i < n; i++) {
  strs.push(randomString())
}

console.time('insert ' + n)

var map = hamt.empty

for (var i = 0; i < n; i++) {
  map = hamt.set(map, strs[i], 1)
}

console.timeEnd('insert ' + n)

console.time('lookup ' + n)

for (var i = 0; i < n; i++) {
  if (hamt.get(map, strs[i]) !== 1) {
    console.log('error', i, hamt.get(map, strs[i]))
  }
}
console.timeEnd('lookup ' + n)

console.time('delete ' + (n / 2))

for (var i = 0; i < (n / 2); i++) {
  map = hamt.del(map, strs[i])
}

console.timeEnd('delete ' + (n / 2))

console.time('post-delete lookup ' + (n / 2))

for (var i = (n / 2); i < n; i++) {
  if (hamt.get(map, strs[i]) !== 1) {
    console.log('error post-delete', i, hamt.get(map, strs[i]))
  }
}

console.timeEnd('post-delete lookup ' + (n / 2))

/**
 * Use dotted path strings because that's what
 * i'm using this for
 */

function randomString () {
  var octets = Math.floor(Math.random() * 10)
  var parts = []

  for (var i = 0; i < octets; i++) {
    parts.push(Math.floor(Math.random() * 10))
  }

  return parts.join('.')
}
