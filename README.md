# pi2.js
A simple Circle based Physics JavaScript library that handles the basics interactions between Circles.

### Author: Fahad Haidari

## Running the examples
In the index.html file, comment/uncomment the desired example to run it. You can view all code *examples* in the examples directory.

## How to use pi2?

Simply, include pi2.js in your main html file.

```<script src="pi2.js"></script>```

Then in your main `.js` file

```
pi2.setup = function () {
  this.width = 400;
  this.height = 400;
  this.color = '#222222';
  this.friction = 0.999;
  this.gravity = { x: 0, y: 1.2 };
  this.isCheckBorders = true;
  this.border = {
    color: '#999',
    width: 5,
    radius: 1,
  }
}

```
*Note: everything above is optional*

Then, you should call this function to start the engine:

```pi2.start();```

## Draw a circle

```
const exampleCircle = pi2.draw.circle({
    id: 1,
    x: 200,
    y: 200,
    radius: 15,
    color: 'orange',
    vel: new pi2.Vector(1, 0),
    isRigidBody: true,
    isStatic: false,
    isUpdate: true,
    extension: { // if you want to assign custom props
        customNumber: 4,
        customArray: [],
        customString: 'custom string',
        customBool: true,
    }
});
```
*Note: everything above is optional*

## Draw a text

```
const exampleText = pi2.draw.text({ 
    id: 5,
    text: 'Some text...',
    size: 14,
    x: 80,
    y: 400,
    color: 'yellow',
    family: 'Courier New'
});
```
*Note: everything above is optional*

## Draw a line
```
pi2.draw.line(startX, startY, endX, endY);
```

## Collision between circles

```
pi2.onCollision = function (circle1, circle2) {
    console.log(circle1, 'collided with', circle2);
}
```

## Access the engine loop

```
pi2.onUpdate = function () {
  // update things here
}
```

## Mouse inputs

```
pi2.onMouseDown = function(data) {
    console.log(data.target);
    console.log(data.mouse.x);
    console.log(data.mouse.y);
}

pi2.onMouseUp = function(data) {
    console.log(data.mouse.x);
    console.log(data.mouse.y);
}

pi2.onMouseMove = function(data) {
    console.log(data.mouse.x);
    console.log(data.mouse.y);
}
```

## Keyboard inputs

```
pi2.onKeyDown = function (keyCode) {
    console.log(keyCode);
}

pi2.onKeyUp = function (keyCode) {
    console.log(keyCode);
}

```

## Create a Vector

```
const vec = new pi2.Vector(0, 0);
```

### Get the magnitude of a Vector

```
vec.magnitude();
```

### Normalize a vector

```
vec.normalize();
```

## Utilities

```
pi2.util.randomInt(min, max);
```

```
pi2.util.randomDouble(min, max);
```

```
pi2.util.randomColor();
```

### Iteration (loop)

```
pi2.repeat(index => {
    // do something 10 times
}, 10);
```

## Random info:

1. You can access the props of an object directly after creation.

    Some examples: 

    ```
    myCircle.x = 100;
    myCircle.color = 'blue';
    myCircle.radius = 35;
    myText.text = 'changed text';
    myText.family = 'Arial Black';
    ```

2. You can access screen width/height like this:

    ```
    pi2.SCREEN.width

    pi2.SCREEN.height
    ```
