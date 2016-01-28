/**
 * Imports
 */

import popcount from '@f/popcount'
import hash from '@f/hash-str'

/**
 * Constants
 */

const bits = 5
const size = Math.pow(2, bits)
const mask = size - 1

/**
 * Types
 */

const LEAF = 'LEAF'
const BRANCH = 'BRANCH'
const COLLISION = 'COLLISION'

/**
 * Mini HAMT
 */

const empty = createBranch()

function set (hamt, key, value) {
  const code = hash(key)
  return insert(hamt, code, key, value)
}

function insert (node, code, key, value, depth = 0) {
  const frag = getFrag(code, depth)
  const mask = 1 << frag

  switch (node.type) {
    case LEAF: {
      if (node.code === code) {
        if (node.key === key) {
          return createLeaf(code, key, value)
        }

        return createCollision(
          code,
          [node, createLeaf(code, key, value)]
        )
      } else {
        const prevMask = 1 << getFrag(node.code, depth)
        const children = prevMask < mask
          ? [node, createLeaf(code, key, value)]
          : [createLeaf(code, key, value), node]

        return createBranch(
          mask | prevMask,
          children
        )
      }
    }
    case BRANCH: {
      const idx = popcount(node.mask, frag)
      const children = node.children

      // If there is already a node for this bit, recurse
      if (node.mask & mask) {
        const child = children[idx]
        return createBranch(
          node.mask,
          arrayReplace(children, idx, insert(child, code, key, value, depth + 1))
        )
      } else {
        return createBranch(
          node.mask | mask,
          arrayInsert(children, idx, createLeaf(code, key, value))
        )
      }
    }
    case COLLISION: {
      for (let i = 0, len = node.children.length; i < len; ++i) {
        if (node.children[i].key === key) {
          return createCollision(
            node.code,
            arrayReplace(node.children, i, createLeaf(code, key, value))
          )
        }
      }

      return createCollision(
        node.code,
        node.children.concat(createLeaf(code, key, value))
      )
    }
  }
}

function get (hamt, key) {
  const code = hash(key)
  let node = hamt
  let depth = -1

  while (true) {
    ++depth

    switch (node.type) {
      case BRANCH: {
        const frag = getFrag(code, depth)
        const mask = 1 << frag

        if (node.mask & mask) {
          const idx = popcount(node.mask, frag)
          node = node.children[idx]
          continue
        } else {
          return
        }
      }
      case COLLISION: {
        console.log('collision bucket')
        for (let i = 0, len = node.children.length; i < len; ++i) {
          const child = node.children[i]
          if (child.key === key) {
            return child.value
          }
        }

        return undefined
      }
      case LEAF: {
        return node.key === key
          ? node.value
          : undefined
      }
    }
  }
}

function del (hamt, key) {
  const code = hash(key)
  const res = remove(hamt, code, key, 0)

  return res === undefined
    ? hamt
    : res
}

function remove (node, code, key, depth) {
  const frag = getFrag(code, depth)
  const mask = 1 << frag

  switch (node.type) {
    case LEAF: {
      // null means remove, undefined
      // means do nothing
      return node.key === key ? null : undefined
    }
    case BRANCH: {
      if (node.mask & mask) {
        const idx = popcount(node.mask, frag)
        const res = remove(node.children[idx], code, key, depth + 1)
        if (res === null) {
          const newMask = node.mask & ~mask

          if (newMask === 0) {
            return null
          } else {
            return createBranch(
              newMask,
              arrayRemove(node.children, idx)
            )
          }
        } else if (res === undefined) {
          return undefined
        } else {
          return createBranch(node.mask, node.children)
        }
      } else {
        return undefined
      }
    }
    case COLLISION: {
      if (node.code === code) {
        for (let i = 0, len = node.children.length; i < len; ++i) {
          const child = node.children[i]

          if (child.key === key) {
            return createCollision(
              node.code,
              arrayRemove(node.children, i)
            )
          }
        }
      }

      return undefined
    }
  }
}

/**
 * Node creators
 */

function createBranch (mask = 0, children = []) {
  return {
    type: BRANCH,
    mask,
    children
  }
}

function createCollision (code, children) {
  return {
    type: COLLISION,
    code,
    children: children
  }
}

function createLeaf (code, key, value) {
  return {
    type: LEAF,
    code,
    key,
    value
  }
}

/**
 * Helpers
 */

function arrayInsert (arr, idx, item) {
  arr = arr.slice()
  arr.splice(idx, 0, item)
  return arr
}

function arrayRemove (arr, idx) {
  arr = arr.slice()
  arr.splice(idx, 1)
  return arr
}

function arrayReplace (arr, idx, item) {
  arr = arr.slice()
  arr[idx] = item
  return arr
}

function getFrag (code, depth) {
  return (code >>> (4 * depth)) & mask
}

/**
 * Exports
 */

export {
  set,
  get,
  del,
  empty
}
