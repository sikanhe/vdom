// Represention for a DOM Node
// {
//   type: 'div',
//   props: {
//     className: "some-class",
//     otherAttribute: "foo"
//   },
//   children: [...other vdom nodes]
// }
function createElement(type, props, children) {
  return {
    type,
    props,
    children
  };
}

function toDomNode(el) {
  if (typeof el === "string") {
    return document.createTextNode(el);
  }

  const node = document.createElement(el.type);
  const { props } = el

  Object.keys(props).forEach(key => {
    node.setAttribute(key, props[key])
  });

  el.children.forEach(el => node.appendChild(toDomNode(el)));
  return node;
}

function hasChanged(e1, e2) {
  return (
    typeof e1 !== typeof e2 ||
    (typeof e1 === "string" && e1 !== e2) ||
    e1.type !== e2.type
  );
}

function updateProps(domNode, {props: oldProps}, {props: newProps}) {
  const props = Object.assign({}, oldProps, newProps)

  Object.keys(props).forEach(key => {
    if (!domNode.hasAttribute(key) || oldProps[key] !== newProps[key]) {
      domNode.setAttribute(key, newProps[key]);
    }

    if (!newProps[key]) {
      domNode.removeAttribute(key)
    }
  })
}

function update(parentDomNode, oldEl, newEl, index = 0) {
  // Store and return operations for visualization/debugging
  let operations = [];

  const domNode = parentDomNode.childNodes[index]

  if (!oldEl) {
    operations.push({ type: "APPEND", el: newEl });
    parentDomNode.appendChild(toDomNode(newEl));
    return operations;
  }

  if (!newEl) {
    operations.push({ type: "REMOVE", el: oldEl });
    parentDomNode.removeChild(domNode);
    return operations;
  }

  if (hasChanged(oldEl, newEl)) {
    operations.push({
      type: "REPLACE",
      old: oldEl,
      new: newEl
    });

    parentDomNode.replaceChild(
      toDomNode(newEl),
      domNode
    );

    return operations;
  }

  // Recursively update the children if change is not the current node
  // but deeper down the tree
  if (typeof newEl !== 'string') {
    updateProps(domNode, oldEl, newEl)

    // WARN: need to walk from the back of the list to cater to
    // the need to remove nodes, or else indexes gets screwed up

    // TODO:
    // This can be further improved by using a 'Key' attribute so we
    // can know precisely which elements are acutually removes/added
    // and it can also increase performance because less operations

    for (
      let i = Math.max(oldEl.children.length, newEl.children.length) -1;
      i >= 0;
      i--
    ) {
      const ops = update(
        domNode,
        oldEl.children[i],
        newEl.children[i],
        i
      );

      operations = operations.concat(ops);
    }
  }

  return operations
}

function render(vdom, target) {
  update(target, null, vdom);
  let currentVDom = vdom;

  return newVdom => {
    let ops = update(target, currentVDom, newVdom);
    currentVDom = newVdom;
    return ops;
  };
}

module.exports = {
  createElement,
  render
};
