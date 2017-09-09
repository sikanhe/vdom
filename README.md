# VDom

### How to use

```javascript
import { render, createElement } from 'vdom'

const tree = createElement('div', [
  createElement('ul', {}, [])
])

// or using JSX
/** @JSX createElement */
const tree = <div><ul></ul></div>

//render returns an `update` function for updating the vdom
const update = render(tree, document.getElementById('root'))

const newTree = createElement('div', [
  createElement('ul', {}, [
    createElement('li', {}, ['hello']),
    createElement('li', {}, ['world'])
  ])
])

// JSX version
const newTree = <div>
  <ul>
    <li>hello</li>
    <li>world</li>
  </ul>
</div>

// Update diffs the vdom trees and apply the changes to the DOM.
// returns an array representing the series of operations applied
// for the update.
// This function mutates the DOM.

update(newTree)
// #=> [{type: "APPEND", el: "li"}, {type: "APPEND", el: "li"}]

update(tree)
// #=> [{type: "REMOVE", el: "li"}, {type: "REMOVE", el: "li"}]

```