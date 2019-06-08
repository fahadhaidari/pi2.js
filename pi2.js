const pi2 = (function () {
  const circleDictionary = {};
  const textDictionary = {};
  const SCREEN = { width: 400, height: 400 };
  let canvas = null;
  let context = null;
  // let sortedCircleArray = [];
  let isCheckBorders;
  let friction = 0.99;
  let gravity = { x: 0, y: 0 };
  let delta = 0;
  let lastTick = performance.now();
  let timestep = 1000 / 60;

  function Text(config) {
    let size = config.size || 14;
    let family = config.family || 'Courier';

    this.id = config.id || Object.keys(textDictionary).length + 1;
    this.text = config.text || '';
    this.x = config.x || 5;
    this.y = config.y || size;
    this.size = size;
    this.family = family;
    this.color = config.color || 'orange';

    textDictionary[this.id] = this;
  }

  Text.prototype.draw = function () {
    context.fillStyle = this.color;
    context.font = `${this.size}px ${this.family}`;
    context.textAlign = "left";
    context.fillText(this.text, this.x, this.y);
  }

  Text.prototype.remove = function () {
    delete textDictionary[this.id];
  }

  function Circle(config) {
    this.id = config.id || Object.keys(circleDictionary).length + 1;
    this.x = config.x || 0;
    this.y = config.y || 0;
    this.z = config.z || 0;
    this.radius = config.radius || 20;
    this.color = config.color || '#FF8888';
    this.vel = config.vel || new Vector(0, 0);
    this.isCheckBorders = (config.isCheckBorders === false) ? false : true;
    this.isOutline = (config.isOutline === true) ? true : false,
    this.isRigidBody = (config.isRigidBody == false) ? false : true;
    this.isStatic = (config.isStatic === true) ? true : false;
    this.isUpdate = (config.isUpdate === false) ? false : true;
    this.mass = config.radius * 0.01;
    this.extension = config.extension || {};

    circleDictionary[this.id] = this;

    // sortedCircleArray = Object.values(circleDictionary).sort(sortBy("z"));
  }

  Circle.prototype.checkBorders = function () {
    if (this.x + this.radius > canvas.width || this.x - this.radius < 0) {
      this.vel.x *= -1;
      this.vel.x *= 0.6;
      this.vel.y *= 0.6;
    }

    if (this.y + this.radius > canvas.height || this.y - this.radius < 0) {
      this.vel.y *= -1;
      this.vel.x *= 0.6;
      this.vel.y *= 0.6;
    }

    while (this.x - this.radius <= 0) {
      this.x ++;
    }

    while (this.x + this.radius >= canvas.width) {
      this.x --;
    }

    while (this.y - this.radius < 0) {
      this.y ++;
    }

    while (this.y + this.radius >= canvas.height) {
      this.y --;
    }

    if (Math.abs(this.vel.x) <= 0.1) this.vel.x = 0;

    if (Math.abs(this.vel.y) <= 0.1) this.vel.y = 0;
  }

  Circle.prototype.draw = function () {
    context.beginPath();
    let drawMethodName = 'fill';

    if (this.isOutline) {
      context.strokeStyle = this.color;
      drawMethodName = 'stroke';
    } else context.fillStyle = this.color;

    context.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
    context[drawMethodName]();
    context.closePath();
  }

  Circle.prototype.remove = function () {
    // const index = sortedCircleArray.indexOf(this);
    // sortedCircleArray.splice(index, 1);
    delete circleDictionary[this.id];
  }

  Circle.prototype.update = function (dt) {
    if (!this.isUpdate) return;

    if (!this.isStatic) {
      this.vel.x *= friction;
      this.vel.y *= friction;
      this.vel.x += gravity.x;
      this.vel.y += gravity.y;
      this.x += this.vel.x * dt / 10;
      this.y += this.vel.y * dt / 10;
    }

    if (!isCheckBorders && !this.isCheckBorders) return;

    this.checkBorders();
  }

  const Vector = function(x, y) {
    this.x = x;
    this.y = y;
  }

  Vector.prototype.dir = () => Math.atan2(this.y, this.x);

  Vector.prototype.magnitude = function() {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }

  Vector.prototype.normalize = function() {
    const mag = this.magnitude();
    this.x /= mag;
    this.y /= mag;
  }

  Vector.prototype.mult = function(val) {
    this.x *= val;
    this.y *= val;
  }

  Vector.dotProduct = function(v1, v2) {
    return v1.x * v2.x + v1.y * v2.y;
  }

  const line = function (sx, sy, tx, ty) {
    context.beginPath();
    context.strokeStyle = 'white';
    context.moveTo(sx, sy);
    context.lineTo(tx, ty);
    context.closePath();
    context.stroke();
  };

  const sortBy = p => (a, b) => a[p] - b[p];

  const protect = function (obj) {
    return new Proxy(obj, {
      set: function (obj, prop, val) {
        if (Object.keys(obj).includes(prop) || prop === 'extension') {
          obj[prop] = val;
        } else {
          throw new Error(`Cannot set property ${prop} Try ${obj}.extension.${prop}`);
        }
      }
    })
  };

  const update = function (dt) {
    for (let i in circleDictionary) {
      const circle1 = circleDictionary[i];
      circle1.update(dt);

      if (!circle1.isRigidBody) continue;

      for (let j in circleDictionary) {
        const circle2 = circleDictionary[j];

        if (circle1.id !== circle2.id) {
          // no need to run Circle vs Circle collision test
          // so make sure they are close by running Quad vs Quad collision test first
          if (circle1.x + circle1.radius < circle2.x - circle2.radius || circle1.x - circle1.radius > circle2.x + circle2.radius ||
            circle1.y + circle1.radius < circle2.y - circle2.radius || circle1.y - circle1.radius > circle2.y + circle2.radius) {
            continue;
          }

          // the intersection vector
          const interSecVec = new Vector(circle2.x - circle1.x, circle2.y - circle1.y);
          // the magnitude of intersection vector
          const distance = interSecVec.magnitude();

          // the sum of radii for circle1 and circle2
          const sumRadii = circle1.radius + circle2.radius;

          // is there an intersection
          if (distance < sumRadii) {

            if (pi2['onCollision']) pi2.onCollision(circle1, circle2);

            if (!circle2.isRigidBody) continue;


            // uncomment to see the vector of intersection
            // line(circle1.x, circle1.y, circle2.x, circle2.y);  

            // normalize the intersection vector
            interSecVec.normalize();

            // separate the two circles after intersection (static response)
            const overlap = 0.5 * (distance - circle1.radius - circle2.radius);

            circle1.x -= overlap * (circle1.x - circle2.x) / distance;
            circle1.y -= overlap * (circle1.y - circle2.y) / distance;

            circle2.x += overlap * (circle1.x - circle2.x) / distance;
            circle2.y += overlap * (circle1.y - circle2.y) / distance;

            // the vector of the tangent line intersection relative to the intersection vector
            const tanVec = new Vector(-interSecVec.y, interSecVec.x);

            // the dot product between the velocity vector of circle1 and the tangent vector
            const dpTan1 = Vector.dotProduct(circle1.vel, tanVec);

            // the dot product between the velocity vector of circle2 and the tangent vector
            const dpTan2 = Vector.dotProduct(circle2.vel, tanVec);

            // the dot product between the velocity vector of circle1 and the intersection vector
            const dpNorm1 = Vector.dotProduct(circle1.vel, interSecVec);

            // the dot product between the velocity vector of circle2 and the intersection vector
            const dpNorm2 = Vector.dotProduct(circle2.vel, interSecVec);

            // the conservation of momentor
            const m1 = (dpNorm1 * (circle1.mass - circle2.mass) + 2 * circle2.mass * dpNorm2) / (circle1.mass + circle2.mass);
            const m2 = (dpNorm2 * (circle2.mass - circle1.mass) + 2 * circle1.mass * dpNorm1) / (circle1.mass + circle2.mass);

            // update velocities of circle1 and circle2
            if (!circle1.isStatic) {
              circle1.vel.x = tanVec.x * dpTan1 + interSecVec.x * m1;
              circle1.vel.y = tanVec.y * dpTan1 + interSecVec.y * m1;
            }

            if (!circle2.isStatic) {
              circle2.vel.x = tanVec.x * dpTan2 + interSecVec.x * m2;
              circle2.vel.y = tanVec.y * dpTan2 + interSecVec.y * m2;
            }
          }
        }
      }
    }
  };

  const draw = function () {
    context.clearRect(0, 0, canvas.width, canvas.height);

    // for (let i = sortedCircleArray.length - 1; i >= 0; i --) {
    //   sortedCircleArray[i].draw();
    // }

    for (let cKey in circleDictionary) {
      circleDictionary[cKey].draw();
    }

    for (let tKey in textDictionary) {
      textDictionary[tKey].draw();
    }
  };

  const frame = function (now) {
    delta += now - lastTick;
    lastTick = now;

    while (delta >= timestep) {
      update(timestep);
      delta -= timestep;
    }

    draw();

    if (pi2.onUpdate) pi2.onUpdate();

    requestAnimationFrame(frame);
  };

  const init = function () {
    let d = {
      color: 'red',
      width: 400,
      height: 400,
      gravity: { x: 0, y: 0 },
      friction: 0.99,
      isCheckBorders: true,
      border: {
        color: '#2288FF',
        width: 0,
        radius: 0,
      }
    };
    pi2.setup.call(d);

    canvas = document.createElement('canvas');
    canvas.style.display = 'block';
    canvas.style.margin = '0px auto';
    canvas.style.background = d.color || '#111111';
    canvas.style.border = `solid ${d.border.width}px ${d.border.color}`;
    canvas.style.borderRadius = `${d.border.radius}px`;
    document.body.appendChild(canvas);
    document.body.style.background = '#000000';
    SCREEN.width = canvas.width = d.width;
    SCREEN.height = canvas.height = d.height;
    canvas.style.marginTop = `${((window.innerHeight / 2) - (canvas.height / 2))}px`;
    context = canvas.getContext('2d');

    gravity = d.gravity;
    friction = d.friction;
    isCheckBorders = d.isCheckBorders;

    d = null;

    canvas.onmousedown = e => {
      let target = null;

      for (let key in circleDictionary) {
        const c = circleDictionary[key];

        const dx = e.offsetX - c.x;
        const dy = e.offsetY - c.y;
        const d = Math.sqrt(dx * dx + dy * dy);

        if (d < c.radius) {
          target = c;
          break;
        }
      }

      if (pi2.onMouseDown) pi2.onMouseDown({
        target: target,
        mouse: { x: e.offsetX, y: e.offsetY }
      });
    };

    canvas.onmouseup = e => {
      if (pi2.onMouseUp) pi2.onMouseUp({
        mouse: { x: e.offsetX, y: e.offsetY }
      });
    };

    canvas.onmousemove = e => {
      if (pi2.onMouseMove) pi2.onMouseMove({
        mouse: { x: e.offsetX, y: e.offsetY }
      });
    }

    document.body.onkeydown = e => {
      if (pi2.onKeyDown) pi2.onKeyDown(e.keyCode);
    }

    document.body.onkeyup = e => {
      if (pi2.onKeyUp) pi2.onKeyUp(e.keyCode);
    }

    frame(0);
  }

  return {
    SCREEN,
    start: function () {
      if (pi2.setup) init();
    },
    draw: {
      circle: function (config) {
        if (!config) config = {};

        const c = new Circle({
          id: config.id,
          x: config.x,
          y: config.y,
          z: config.z,
          radius: config.radius,
          color: config.color,
          vel: config.vel,
          isCheckBorders: config.isCheckBorders,
          isOutline: config.isOutline,
          isRigidBody: config.isRigidBody,
          isStatic: config.isStatic,
          isUpdate: config.isUpdate,
          extension: config.extension,
        });

        const protected = protect(c);
        return protected;
      },
      line,
      text: function (config) {
        const t = new Text({
          id: config.id,
          x: config.x,
          y: config.y,
          text: config.text,
          size: config.size,
          color: config.color,
          family: config.family,
        });
        return t;
      },
    },
    repeat: function (callback, n) {
      let i = 0;

      for (i = 0; i < n; i++) {
        callback(i);
      }
    },
    util: {
      randomInt: function (min, max) {
        return parseInt(Math.random() * (max - min) + min);
      },
      randomDouble: function (min, max) {
        return Math.random() * (max - min) + min;
      },
      randomColor: function () {
        return '#' + Math.random().toString(16).substr(-6);
      },
    },
    Vector,
  }
})();