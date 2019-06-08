const mouse = { x: 0, y: 0 };
const p = { x: 0, y: 0 };
const pocketColor = '#000000';
const pocketSize = 25;
const _radius = 10;
const colors = 
[
  'green',
  'yellow',
  'blue',
  'orange',
  'purple',
  'black',
  'red',
  '#FF4444',
  'brown'
];
let score = 0;
let isMouseDown = false;

pi2.setup = function() {
  this.width = 600;
  this.height = 550;
  this.color = '#3ab503';
  this.gravity = { x: 0, y: 0 };
  this.friction = 0.99;
  this.checkBorders = true;
}

pi2.start();

pi2.repeat(i => {
  pi2.repeat(j => {
    const c = pi2.draw.circle({
      x: 280 + (j * _radius * 2),
      y: 180 + (i * _radius * 2),
      vel: new pi2.Vector(0, 0),
      radius: _radius,
      color: colors[pi2.util.randomInt(0, colors.length)],
    });
  }, 4);
}, 4);

const titleText = pi2.draw.text({
  text: 'Drag and release using the mouse',
  size: 20, 
  x: 150, 
  color: 'black', 
  family: 'Arial'
});

const scoreText = pi2.draw.text({
  text: 'SCORE: 0',
  size: 20, 
  x: 240, 
  y: pi2.SCREEN.height - 20,
  color: '#DDDDDD', 
  family: 'Arial'
});

const demoText = pi2.draw.text({ 
  text: 'DEMO',
  size: 14,
  x: 30,
  y: pi2.SCREEN.height - 14,
  color: 'black',
  family: 'Courier New'
});

const tBall = pi2.draw.circle({
  id: 1000,
  x: 310,
  y: 420,
  vel: new pi2.Vector(0, .5),
  radius: _radius,
  color: 'white',
  isUpdate: false,
});

const createPocket = function(x, y) {
  return pi2.draw.circle({
    x,
    y,
    color: pocketColor,
    radius: pocketSize,
    checkBorders: false,
    isRigidBody: false,
    isCheckBorder: false,
    isUpdate: false,
  })
};

const bottomRightPocket = createPocket(pi2.SCREEN.width, pi2.SCREEN.height);
const bottomLeftPocket  = createPocket(0, pi2.SCREEN.height);
const topLeftPocket     = createPocket(0, 0);
const topRightPocket    = createPocket(pi2.SCREEN.width, 0);

pi2.onUpdate = function() {
  if (isMouseDown) pi2.draw.line(p.x, p.y, mouse.x, mouse.y);
}

pi2.onCollision = function(c1, c2) {
  if (c2.id === topLeftPocket.id || c2.id === topRightPocket.id || c2.id === bottomLeftPocket.id || c2.id === bottomRightPocket.id) {
    if (c1.id !== tBall.id) {
      if (Math.abs(c1.x - c2.x) < c2.radius && Math.abs(c1.y - c2.y) < c2.radius) {
        score ++;
        scoreText.text = 'SCORE:' + score;
        c1.remove();
      }
    }
  }
}

pi2.onMouseDown = function(data) {
  isMouseDown = true;

  mouse.x = p.x = data.mouse.x;
  mouse.y = p.y = data.mouse.y;
  tBall.x = mouse.x;
  tBall.y = mouse.y;
  tBall.isUpdate = false;
}

pi2.onMouseUp = function(data) {
  isMouseDown = false;

  const forceVector = new pi2.Vector(p.x - mouse.x, p.y - mouse.y);
  const forceMag = forceVector.magnitude();
  forceVector.normalize();

  tBall.vel = {
    x: forceVector.x * forceMag * 0.05,
    y: forceVector.y * forceMag * 0.05
  };

  tBall.isUpdate = true;
}

pi2.onMouseMove = function(data) {
  if (isMouseDown) {
    tBall.x = mouse.x = data.mouse.x;
    tBall.y = mouse.y = data.mouse.y;
  }
}
