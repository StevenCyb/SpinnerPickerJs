# SpinnerPickerJs
SpinnerPickerJs is a JS library that provides an input element for mobile devices and desktop.
As described in the following figure, there are several input options that can be switched on and off via the configuration.
![Demo](/demo.png)
## How To Use It
The following code shows how the library can be use in a age selection example (between 1-100 years).
A detailed description of the functions is given in the next section.
```HTML
<!-- Include the library -->
<script src="spinner_picker.js"></script>
<!-- Important to prevent mobile reloading when overscroll -->
<style>
body {
    overscroll-behavior: contain;
}
</style>
<!-- Create a HTMLCanvasElement -->
<h1>Select your age:</h1>
<canvas id="sample-age-input"></canvas>
<!-- Instanzierung des SpinnerPickers -->
<script>
    new SpinnerPicker(
        document.getElementById("sample-age-input"), 
        function(index) {
            // Simply allow a selection from 0-99(+1) => 1-100 
            if(index < 0 || index > 99) {
                return null;
            }
            return index + 1;
        }, { index: 29 }, // Set default age to 29(+1) => 30
        function(index) {
            console.log(`You are ${this.getValue()} years old.`);
        }
    );
</script>
```
## Function Overview
The `SpinnerPicker` class contains the following constructor and functtions.
# Configuration And Constructor
```js
/*
 * The value-handler is responsible to translate an index to a selectable item (number or string).
 * The function receives an index and must return the item corresponding to the index.
 */
var valueHandler = function(index) { return index; };
/*
 * The configuration is given by an object.
 * All these attributes have a default value, which is shown below.
 */
var config = {
    index: 0,                   // Default index
    animation_speed: 10,        // Animation speed (can be left like this)
    animation_steps: 5,         // Animation steps (decrease this value to increase the performance and reversed)
    font_color: "#000000",      // Color of font
    selection_color: "#000000", // Color of selected item
    font: "Arial",              // Font style
    onclick: true,              // Use click interaction
    ondblclick: true,           // Use double-click interaction
    onkeydown: true,            // Use key interaction
    onwheel: true,              // Use wheel interaction
    ontouchmove: true,          // Use touchmove interaction
    onresize: true              // Listen vor resize to redraw the view (good if element size is not fixed)
};
/*
 * You can add an on-change event that is triggered whenever the value is changed. 
 * You can simply use the index to get the value or use `this.getValue()` or `obj.getValue()` to get the value directly.
 */
var onchanged = function(index) {};
/*
 * Constructor for instantiating this object.
 * Parameter:
 * canvas: HTMLCanvasElement to use
 * valueHandler: Function with index parameter to translate index to selectable item
 * config: JSON-Object that contains configuration
 * onchanged: Function with index parameter as callback (default: null)
 */
constructor(canvas, valueHandler, config, onchanged)
```
# Remove
```js
/*
 * Remove event listener from canvas and window element
 * Parameter:
 * void
 * Return:
 * void
 */
obj.remove();
```
# Get Value
```js
/*
 * Get current selected value
 * Parameter:
 * void
 * Return:
 * Return current value (not index)
 */
obj.getValue();
```
# Set index
```js
/*
 * Set a new index and update view
 * Parameter:
 * index: The new index value
 * Return:
 * void
 */
obj.setIndex(index)
```
# Update View
```js
/*
 * Function to draw/update the view
 * Parameter:
 * void
 * Return:
 * void
 */
obj.updateView()
```

