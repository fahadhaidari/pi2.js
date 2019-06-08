const mouse = { x: 0, y: 0 };
const p = { x: 0, y: 0 };
const zoneParts = { left: [], right: [], bottom: [] };
const jumpSpeed = 5;
let score = 0;
let time = 20;
let isMouseDown = false;

pi2.setup = function () {
  this.width = 650;
  this.height = 700;
  this.color = '#222222';
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
  color: '#44FF33',
  family: 'Courier New'
});

const timeText = pi2.draw.text({ 
  text: `TIME: ${time}`,
  size: 25,
  y: 30,
  x: pi2.SCREEN.width - 120,
  color: '#FF4433',
  family: 'Courier New'
});

const infoText1 = pi2.draw.text({ 
  text: 'Drag and release mouse to throw the white ball',
  size: 14,
  y: scoreText.y * 2,
  color: '#FFFFFF',
  family: 'Courier New'
});

const infoText2 = pi2.draw.text({ 
  text: 'Collect the small red circle',
  size: 14,
  y: scoreText.y * 3,
  color: '#FFFFFF',
  family: 'Courier New'
});

const tutText = pi2.draw.text({ 
    text: '[MAX DRAG POINT]',
    size: 14,
    x: 80,
    y: 400,
    color: 'yellow',
    family: 'Courier New'
});

const demoText = pi2.draw.text({ 
  text: 'DEMO',
  size: 14,
  x: 10,
  y: pi2.SCREEN.height - 14,
  color: 'orange',
  family: 'Courier New'
});

const tBall = pi2.draw.circle({
    x: 310,
    y: 420,
    vel: new pi2.Vector(0, .5),
    radius: 15,
    color: 'white',
});

const createPoint = function() {
  const newPoint = { x: pi2.util.randomInt(pi2.SCREEN.width - 200, pi2.SCREEN.width - 100), y: pi2.util.randomInt(200, pi2.SCREEN.height - 300)};

  return newPoint;
};

const updateScore = function(val) {
  score = val;
  scoreText.text = 'POINTS:' + score;
};


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

const createZone = function() {
    pi2.repeat(i => {
        zoneParts.left.push(
            pi2.draw.circle({
                radius: 15,
                color: '#4488FF',
                isStatic: true,
                isOutline: true,
            }));
    }, 3);
    pi2.repeat(j => {
        zoneParts.right.push(
            pi2.draw.circle({
                radius: 15,
                color: '#4488FF',
                isStatic: true,
                isOutline: true,
            }));
    }, 3);
}

const updateZone = function(_x, _y, _wide = 80) {
    const len = zoneParts.left.length; // right can be used as well

    pi2.repeat(i => {
        const leftPart = zoneParts.left[i];
        leftPart.x = _x - _wide / 2;
        leftPart.y = _y + (i * 20);
    }, len);

    pi2.repeat(j => {
        const rightPart = zoneParts.right[j];
        rightPart.x = _x + _wide / 2;
        rightPart.y = _y + (j * 20);
    }, len);

    scorePoint.x = _x;
    scorePoint.y = zoneParts.left[Math.floor(len / 2)].y;
}

const reset = function() {
    time = 20;
    tBall.x = tBall.radius * 2;
    tBall.y = pi2.SCREEN.height / 2;
    updateScore(0);
};

reset();
createZone();
updateZone(500, 300);

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
      x: forceVector.x * forceMag * 0.06,
      y: forceVector.y * forceMag * 0.06
    };
  
    tBall.isUpdate = true;
  }
  
pi2.onMouseMove = function(data) {
    if (isMouseDown) {
        tBall.x = mouse.x = data.mouse.x;
        tBall.y = mouse.y = data.mouse.y;

        if (tBall.x > pi2.SCREEN.width / 3) {
            isMouseDown = false;
        }
    }
}

pi2.onUpdate = function () {
    if (isMouseDown) pi2.draw.line(p.x, p.y, mouse.x, mouse.y);

    if (time > 0) {
        time -= 1 / 100;
        timeText.text = `TIME:${parseInt(time).toString()}`;
      } else {
        reset();
      }
}

pi2.onCollision = function (b1, b2) {
  if (b1.id === tBall.id) {
    if (b2.id === scorePoint.id) {
        const rndmP = createPoint();
        b2.x = rndmP.x;
        b2.y = rndmP.y;
        tBall.x = tBall.radius * 2;
        tBall.y = pi2.SCREEN.height / 2;
        updateZone(rndmP.x, rndmP.y);
        updateScore(score + 1);
    }
  }
}