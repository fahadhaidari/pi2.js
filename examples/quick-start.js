pi2.setup = function () {
    this.width = 400;
    this.height = 600;
    this.color = '#000000';
    this.friction = 0.999;
    this.gravity = { x: 0, y: 0 };
    this.isCheckBorders = true;
    this.border = {
      color: '#999',
      width: 1,
      radius: 0
    }
  }

  pi2.start();

  const numCircles = 10;

  const bigCircle = pi2.draw.circle({
    id: 0,
    x: 200,
    y: 300,
    vel: new pi2.Vector(1, 0),
    radius: 40,
    color: 'orange',
  });

  pi2.repeat(i => {
    pi2.draw.circle({
        id: i + 1,
        x: pi2.util.randomInt(20, pi2.SCREEN.width - 40),
        y: pi2.util.randomInt(20, pi2.SCREEN.height - 40),
        vel: new pi2.Vector(pi2.util.randomDouble(-1, 1), pi2.util.randomDouble(-1, 1)),
        radius: pi2.util.randomInt(5, 40),
        color: pi2.util.randomColor(),
      });
  }, numCircles);

  const testText = pi2.draw.text({
    text: 'pi2.js DEMO',
    x: 0,
    y: 0,
    size: 20,
    color: 'orange',
    family: 'Courier'
  });