const jumpSpeed = 5;
let pointHistory = { x: 0, y: 0 };
let isRight = false;
let isLeft = false;
let score = 0;
let time = 20;

pi2.setup = function () {
  this.width = 650;
  this.height = 700;
  this.color = '#FFFFFF';
  this.gravity.y = 0.12;
  this.border = {
    color: '#999',
    width: 5,
  }
}

pi2.start();

const scoreText = pi2.draw.text({ 
  text: 'POINTS: 0',
  size: 25,
  y: 30,
  color: '#4477FF',
  family: 'Courier New'
});

const timeText = pi2.draw.text({ 
  text: `TIME: ${time}`,
  size: 25,
  y: 30,
  x: pi2.SCREEN.width - 120,
  color: 'red',
  family: 'Courier New'
});

const infoText1 = pi2.draw.text({ 
  text: 'Press Left/Right arrows to move left/right, Space to Jump',
  size: 14,
  y: scoreText.y * 2,
  color: '#333333',
  family: 'Courier New'
});

const infoText2 = pi2.draw.text({ 
  text: 'Collect the small red circle',
  size: 14,
  y: scoreText.y * 3,
  color: '#333333',
  family: 'Courier New'
});

const demoText = pi2.draw.text({ 
  text: 'DEMO',
  size: 14,
  x: 10,
  y: pi2.SCREEN.height - 35,
  color: 'orange',
  family: 'Courier New'
});

const jumper = pi2.draw.circle({
  id: 0,
  x: 0,
  y: 220,
  vel: new pi2.Vector(0, 0),
  radius: 10,
  color: '#222222',
  extension: {
    sizeFactor: 0.1,
  }
});

const scorePoint = pi2.draw.circle({
  x: pi2.util.randomInt(10, pi2.SCREEN.width - 6),
  y: 150,
  vel: new pi2.Vector(0, 0),
  radius: 6,
  color: 'red',
  isStatic: true,
  isRigidBody: false,
  extension: {
    sizeFactor: 0.1,
  }
});

pointHistory.x = scorePoint.x;
pointHistory.y = scorePoint.y;

const createStep = function(x, y, radius, color) {
  return pi2.draw.circle({
    x,
    y,
    radius,
    color,
    isStatic: true,
  });
};

const createPoint = function() {
  let newPoint = { x: pi2.util.randomInt(100, pi2.SCREEN.width), y: pi2.util.randomInt(100, pi2.SCREEN.height - 100)};
  let dx = Math.abs(pointHistory.x - newPoint.x);
  let dy = Math.abs(pointHistory.y - newPoint.y);

  while (dx < 100 || dy < 100) {
    newPoint = { x: pi2.util.randomInt(10, pi2.SCREEN.width), y: pi2.util.randomInt(100, pi2.SCREEN.height - 100)};
    dx = Math.abs(pointHistory.x - newPoint.x);
    dy = Math.abs(pointHistory.y - newPoint.y);
  }

  return newPoint;
};

const updateScore = function(val) {
  score = val;
  scoreText.text = 'POINTS:' + score;
};

const step1 = createStep(100, 500, 40, 'orange');
const step2 = createStep(200, 350, 30, '#FF8888');
const step3 = createStep(300, 250, 30, 'blue');
const step4 = createStep(500, 300, 80, '#66FF44');
const step5 = createStep(550, 500, 25, 'yellow');
const step6 = createStep(350, 550, 55, '#6F4AA9');

const size = pi2.SCREEN.width / 25;

pi2.repeat(i => {
  pi2.draw.circle({
    id: -(i + 1),
    x: size * 2 + i * 40,
    y: pi2.SCREEN.height,
    radius: size,
    color: '#444444',
    // color: pi2.util.randomColor(),
    vel: new pi2.Vector(0, 0),
    isStatic: true,
    isUpdate: false,
    isOutline: true,
  });
}, 15);

pi2.onKeyDown = function (key) {
  if (key === 32) {
    jumper.vel.y = -jumpSpeed;
  }
  if (key === 37) {
    isRight = false;
    isLeft = true;
  }
  if (key === 39) {
    isLeft = false;
    isRight = true;
  }
}

pi2.onKeyUp = function (key) {
  if (key === 37) isLeft = false;
  if (key === 39) isRight = false;
}

pi2.onUpdate = function () {
  if (isLeft)  jumper.vel.x = -2;
  if (isRight) jumper.vel.x = 2;

  scorePoint.extension.sizeFactor += 0.7 % 4;
  scorePoint.radius += Math.cos(scorePoint.extension.sizeFactor);

  if (time > 0) {
    time -= 1 / 100;
    timeText.text = `TIME:${parseInt(time).toString()}`;
  } else {
    jumper.x = pi2.SCREEN.width / 2;
    jumper.y = jumper.radius;
    time = 20;
    updateScore(0);
  }
}

pi2.onCollision = function (b1, b2) {
  if (b1.id === jumper.id) {
    if (b2.id < 0) {
      b2.y = pi2.SCREEN.height;
      b1.vel.y = 0;
    }
  }
    
  if (b2.id === scorePoint.id) {
    const p = createPoint();
    pointHistory.x = p.x;
    pointHistory.y = p.y;
    b2.x = p.x;
    b2.y = p.y;
    updateScore(score + 1);
  }
}