// var hamt = require('.')
//
// // Crude benchmarks for now
//
// var strs = []
//
// for (var i = 0; i < 5000; i++) {
//   strs.push(randomString())
// }
//
// console.time('insert 5000')
//
// var map = hamt.empty
//
// for (var i = 0; i < 5000; i++) {
//   map = hamt.set(map, strs[i], 1)
// }
//
// console.timeEnd('insert 5000')
//
// console.time('lookup 5000')
//
// for (var i = 0; i < strs.length; i++) {
//   if (hamt.get(map, strs[i]) !== 1) {
//     console.log('error', i, hamt.get(map, strs[i]))
//   }
// }
//
// console.timeEnd('lookup 5000')
//

var hash = require('@f/hash-str')
var times = require('@f/times')

/**
 * Use dotted path strings because that's what
 * i'm using this for
 */

function randomString () {
  var octets = 3 //Math.floor(Math.random() * 10)
  var parts = []

  for (var i = 0; i < octets; i++) {
    parts.push(Math.floor(Math.random() * 10))
  }

  return parts.join('.')
}

console.log(times(100, randomString).map(hash))
