
# mini-hamt

[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat)](https://github.com/feross/standard)

Minimal, functional HAMT (Hash Array Mapped Trie) implementation for immutable maps. Similar to other libraries like [ImmutableJS](https://github.com/facebook/immutable-js) or [hamt](https://github.com/mattbierner/hamt), but without all the frills and associated bloat. It's other big advantage is that it doesn't use classes or prototypes, just plain data, so serialization is free and easy.

## Installation

    $ npm install mini-hamt

## Usage

Use it as an immutable map. You can set, get, and delete keys from it (no iteration for the time being, post an issue if you want it). If you want to create a new map, just modify the provided empty map.

```javascript
import * as hamt from 'mini-hamt'

let map = hamt.empty

const map = hamt.set(hamt.empty, 'test', 1)

hamt.get(map, 'test') === 1

const map2 = hamt.set(map, 'test2', 2)

hamt.get(map2, 'test2') === 2
hamt.get(map, 'test2') === undefined


const map3 = hamt.del(map2, 'test')

hamt.get(map3, 'test') === undefined
hamt.get(map2, 'test') === 1
```

## License

MIT
