/**
 * Imports
 */

var hash = require('@f/hash-str')
var filterObj = require('@f/filter-obj')

console.log('collisions', search())

/**
 * Find collisions
 */

function search () {
  var seen = {}
  var hashes = {}

  for (var i = 0; i < 1000000; i++) {
    var str = randomString()
    if (!seen[str]) {
      seen[str] = true
      var code = hash(str)
      if (hashes[code]) {
        hashes[code].push(str)
      } else {
        hashes[code] = [str]
      }
    }
  }

  return filterObj(strs => strs.length > 1, hashes)
}

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
