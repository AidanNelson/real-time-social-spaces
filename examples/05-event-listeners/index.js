/*
This example shows the use of event listeners and event handlers.  Additionally, it uses "anonymous arrow functions" (explained below).

*/

// There are a few different ways to create functions in Javascript.

// named functions use the 'function' keyword
function logHello() {
  console.log("Hello!");
}

// arrow functions use arrow '() => {}' syntax
let logGoodbye = () => {
  console.log("Goodbye!");
};

// to add an event listener
// we can first declare a listener function (using either of the two approaches listed above)
function onClick() {
  console.log("Clicked on window!");
}

// then listen to a particular event (click in the example below) on a particular event target (window in the example below)
window.addEventListener("click", onClick, false);

// it can sometimes be preferable to use 'anonymous' functions (functions without names)
window.addEventListener(
  "click",
  function () {
    console.log("Clicked on window (using anonymous function event handler)!");
  },
  false
);

// we can also use anonymous arrow functions (which we will do from now on)
window.addEventListener("click", () => {
  console.log(
    "Clicked on window (using anonymous arrow function event handler)!"
  );
});

// why use one or the other approach?  Well, there are a few reasons relating
// to making readable and debuggable code and one other big reason relating to
// function scope, which will come up when using classes
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions

//~//~//~//~//~//~//~//~//~//~//~//~//~//~//~//~//
let blueHoverDiv = document.getElementById("blueHoverDiv");

blueHoverDiv.addEventListener(
  "mouseover",
  () => {
    blueHoverDiv.style.background = "lightblue";
  },
  false
);

blueHoverDiv.addEventListener(
  "mouseleave",
  () => {
    blueHoverDiv.style.background = "white";
  },
  false
);

//~//~//~//~//~//~//~//~//~//~//~//~//~//~//~//~//
let clickDiv = document.getElementById("clickDiv");

clickDiv.addEventListener("click", (ev) => {
  console.log("click event: ", ev);
  clickDiv.innerText = "Thanks! 🎉";
});

//~//~//~//~//~//~//~//~//~//~//~//~//~//~//~//~//
let outerDiv = document.getElementById("nestedOuterDiv");
let innerDiv = document.getElementById("nestedInnerDiv");

innerDiv.addEventListener(
  "click",
  (ev) => {
    ev.stopPropagation();
    console.log("Clicked Inner Div!");
  },
  false
);

outerDiv.addEventListener(
  "click",
  (ev) => {
    console.log("Clicked Outer Div!");
  },
  false
);

// we can also get information from the 'event' object passed into the event handler function
window.addEventListener(
  "click",
  (ev) => {
    console.log("Click X:", ev.clientX, " / Y:", ev.clientY);
  },
  false
);

window.addEventListener(
  "keyup",
  (ev) => {
    console.log("Key pressed:", ev.key);
  },
  false
);
