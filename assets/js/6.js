/** Genuary Day 6 */

const g = new GUM3D.Gum('#canvas')

const html = document.querySelector(':root');
let fg = g.color(getComputedStyle(html).getPropertyValue('--text-color'));
let bg = g.color('rgba(0,0,0,0)');

let ball, container;
let buffer = 0.1
let SPEED = 0.04;


let balls = [];



function setup() {
  g.addProgram('line2')
  let box = g.shapes.cube(2);
  let edges = new g.EdgeCollection(box.getEdges())
  edges.color = fg.rgba
  edges.thickness = 4;

  container = g.node().setGeometry(g.mesh(edges))

  ball = g.node().setGeometry(g.mesh(
    g.shapes.icosphere(0.2, 2).fill(fg)
  ))

  ball.velocity = g.vec3(
    Math.random() * 2 - 1,
    Math.random() * 2 - 1,
    Math.random() * 2 - 1,
  ).normalize().mult(SPEED);

  // ball.setParent(container);

  g.recycleBuffer = true;
  g.addEffect('post-depth-fade', {
    uStart: 10,
    uEnd: 18,
    uBlendColor: bg.rgba,
  });
  // g.addEffect('post-blur')
  g.clear(bg)
  g.camera.fov = 40
}

function draw() {
  g.clear(bg)
  g.renderer.cullFace('none')

  let matrix = g.m4.create();
  let invMatrix = g.m4.create();

  container.rotate(g.time * 0.001, g.time * 0.00004, g.time * 0.00006);

  let pos = ball.transform.position.xyz;
  let vel = ball.velocity.xyz;

  // console.log(vel)

  // matrix math. 
  // Copy the tranfor
  g.m4.copy(matrix, container.transform.matrix);
  g.m4.invert(invMatrix, matrix);

  g.m4.transformMat4(pos, pos, invMatrix);
  g.m4.transformMat4(vel, vel, invMatrix);


  let [x, y, z] = pos
  // let [ x, y, z ] = container.transform.transformPoint(ballPos);

  // let v = container.transformNormal()

  let impulse = [0, 0, 0];
  // console.log({x,y,z})
  let collision = false;

  if (x - buffer < -1) {
    vel[0] = Math.abs(vel[0])
    collision = true;
  }
  if (x + buffer > 1) {
    vel[0] = -Math.abs(vel[0])
    collision = true;
  }

  if (y - buffer < -1) {
    vel[1] = Math.abs(vel[1])
    collision = true;
  }
  if (y + buffer > 1) {
    vel[1] = -Math.abs(vel[1]);
    collision = true;
  }

  if (z - buffer < -1) {
    vel[2] = Math.abs(vel[2]);
    collision = true;
  }
  if (z + buffer > 1) {
    vel[2] = -Math.abs(vel[2]);
    collision = true;
  }



  if (collision) {
    g.m4.transformMat4(vel, vel, matrix)
    ball.velocity = g.vec3(...vel).normalize().mult(SPEED);
  }


  ball.transform.position.add(ball.velocity);

  g.drawScene()


}

g.run(setup, draw);