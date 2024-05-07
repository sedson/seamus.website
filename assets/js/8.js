/** Genuary Day 8 */

const g = new GUM3D.Gum('#canvas')

const html = document.querySelector(':root');
let fg = g.color(getComputedStyle(html).getPropertyValue('--text-color'));
let bg = g.color('rgba(0,0,0,0)');

g.pixelRatio = 2.0;
g.imageScaling = 'pixelated'


let bumps = [];

const K = 0.01
const REST_LEN = Math.random() * 0.4 + 0.1;
const DAMPING = 0.9;
const MAX_DIST = 1.4;
const connections = Math.floor(Math.random() * 80) + 15;

const connectivity = 2;

const edges = [];
const edgeRenderData = [];

let edgesNode, root;

let count = 5;
const fac = n => 1 * n / (count - 1) - 0.5;
const rand = () => Math.floor(Math.random() * (count ** 3));

// Make a 3d grid of dots.
for (let y = 0; y < count; y++) {
  for (let x = 0; x < count; x++) {
    for (let z = 0; z < count; z++) {
      bumps.push({
        position: g.vec3(fac(x), fac(y), fac(z)),
        connections: [],
        connected: false,
        velo: g.vec3(Math.random() * 0.1 - 0.05, Math.random() * 0.1 - 0.05, Math.random() * 0.1 - 0.05),
        node: null,
      });
    }
  }
}

// Connect some randomly
for (let i = 0; i < connections; i++) {
  let r = rand();
  let w = rand();
  let connected = 0;
  while (connected < connectivity) {
    let self = bumps[r];

    while (w === r || self.connections.includes(w)) {
      w = rand();
    }

    let other = bumps[w];

    if (!self.connections.includes(w)) {
      self.connections.push(other);
      self.connected = true;
      other.connected = true;
    }
    connected++;
  }
}

// Discard the unconnected
bumps = bumps.filter(x => x.connected)
let i = 0;
for (let bump of bumps) {
  bump.index = i;
  i++;
  for (let other of bump.connections) {

    edges.push([bump, other]);
    edgeRenderData.push([bump.position.xyz, other.position.xyz]);

  }
}

const mesh = g.mesh(
  g.shapes.icosphere(0.05, 2).fill(fg)
)

const edgeCollection = new g.EdgeCollection(edgeRenderData);
edgeCollection.thickness = 1;
edgeCollection.color = fg.rgba

const edgeMesh = g.mesh(edgeCollection)



function renderEdges() {
  for (let i = 0; i < edges.length; i++) {
    edgeRenderData[i][0] = edges[i][0].position.xyz;
    edgeRenderData[i][1] = edges[i][1].position.xyz;
  }

  g.renderer.updateMesh(edgeCollection.name, edgeCollection.render())
}

function simulate(delta) {
  for (let self of bumps) {
    for (let other of self.connections) {
      const vecTo = other.position.copy().sub(self.position);
      const displacement = vecTo.mag() - REST_LEN;
      // console.log({displacement})

      other.velo.add(vecTo.normalize().mult(-K * displacement));

      const dist = self.position.mag();
      const constrain = Math.max(dist - MAX_DIST);
      self.velo.add(self.position.copy().normalize().mult(-K * constrain));

      if (Math.random() < 0.001) {
        self.velo.add(g.vec3(
          (Math.random() * 2 - 1) * 0.04,
          (Math.random() * 2 - 1) * 0.04,
          (Math.random() * 2 - 1) * 0.04,
        ))
      }



    }
  }

  for (let self of bumps) {
    self.position.add(self.velo);
    self.node.move(...self.position.xyz)
    self.velo.mult(DAMPING);

  }



}



function setup() {
  g.addProgram('line2')
  g.addProgram('unlit')


  root = g.node();
  g.clear(bg);

  for (let bump of bumps) {
    bump.node = g.node().setGeometry(mesh).move(...bump.position.xyz);
    bump.node.setParent(root);
  }
  edgesNode = g.node().setGeometry(edgeMesh).setParent(root)


  g.scene.updateSceneGraph();
  g.addEffect('post-depth-fade', {
    uStart: 0,
    uEnd: 1,
    uBlendColor: fg.rgba,
  });
  g.addEffect('post-chromatic2')
  g.clear(bg)
}

function draw(delta) {
  g.clear(bg)
  g.clearDepth()
  g.renderer.cullFace('none')
  simulate(delta)
  renderEdges()
  // root.rotate(0, g.time * 0.0001, 0)

  g.drawScene()
}

g.run(setup, draw);