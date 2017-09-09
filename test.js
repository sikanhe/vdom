const { JSDOM } = require("jsdom");
const { render, createElement } = require("./vdom.js");
const assert = require("assert");

document = new JSDOM(`
  <div id="root"></div>
`).window.document;

const vdom = createElement("div", {}, ["hello world"]);

const vdom2 = createElement("span", { id: "span1", foo: "bar" }, [
  createElement("ul", {}, [
    createElement("li", { id: "li1", foo: "bar" }, ["item1"]),
    createElement("li", {}, ["item2"])
  ])
]);

const vdom3 = createElement("span", { id: "span1", foo: "changed" }, [
  createElement("ul", {id: "ul"}, [
    createElement("li", { id: "li1" }, ["item1"]),
    createElement("li", {}, ["changed"]),
    createElement("li", {}, ["added"])
  ])
]);

const vdom4 = createElement("span", { id: "span1", foo: "changed" }, [
  createElement("ul", {id: "ul"}, [
    createElement("li", { id: "li1" }, ["item1"])
  ])
]);

const update = render(vdom, document.getElementById("root"));

assert.deepEqual(update(vdom2).map(op => op.type), ["REPLACE"]);
assert.deepEqual(update(vdom3).map(op => op.type), ["APPEND", "REPLACE"]);
assert.deepEqual(update(vdom4).map(op => op.type), ["REMOVE", "REMOVE"]);

// Checks for props change
assert.equal(document.getElementById("span1").getAttribute("foo"), "changed");
assert.equal(document.getElementById("li1").hasAttribute("foo"), false);
