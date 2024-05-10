/** Genuary Day 8 */

const g = new GUM3D.Gum('#canvas')

g.pixelRatio = window.devicePixelRatio;

g.shaders.main = {
  // Use the default vertex shader.
  vert: g.shaders.default.vert,

  // And a custom frag shader that will pull from the page colors.
  frag: `
  #version 300 es

  precision mediump float;

  uniform vec4 uColor;

  out vec4 fragColor;

  void main() {
    fragColor = uColor;
  }

  `.trim(),
}

/**
 * 
 */
let root = g.node();
let floor = g.node();

let bg = g.color('#000');
let fg = g.color('#fff');


function _colors() {
  const html = document.querySelector(':root');
  fg = g.color(getComputedStyle(html).getPropertyValue('--text-color'));
  bg = g.color(getComputedStyle(html).getPropertyValue('--page-color'));
  if (root) root.uniforms.uColor = fg.rgba;
  if (g.postProcessingStack.effects.length) {
    g.postProcessingStack.effects[0].uniforms.uColorA = bg.rgba;
    g.postProcessingStack.effects[0].uniforms.uColorB = fg.rgba;
  }

}
_colors();

function r() {
  return (Math.random() - 0.5);
}

/**
 * 
 */
function setup() {
  g.addProgram('main');
  g.addProgram('geo');


  const sphere = g.mesh(g.shapes.icosphere(0.1, 2, false));
  const cube = g.mesh(g.shapes.cube(0.2, true).findGroups());


  // floor.geometry = g.mesh(g.shapes.grid(1, 5).renderEdges());

  root.geometry = sphere;
  root._rotate = 0;

  _colors();

  for (let i = 0; i < 10; i++) {
    let n = g.node()
      .setGeometry(sphere)
      .move(r(), r(), r())
      .rotate(r(), r(), r())
      .setParent(root)
    n.program = 'geo';
    n._rotate = r();

    for (let i = 0; i < 10; i++) {
      let m = g.node()
        .setGeometry(sphere)
        .move(r(), r(), r())
        .rotate(r(), r(), r())
        .setParent(n)
      m.program = 'geo';
    }
  }



  g.addEffect('post-outline', {
    uColorA: bg.rgba,
    uColorB: fg.rgba,
  });
  root.program = floor.program = 'main';
  g.camera.fov = 15;

}

function draw(delta) {
  g.clear(bg);
  g.scene.traverse(x => {
    if (x._rotate) {
      x.rotate(x.rx + 0.03 * delta * x._rotate, x.ry + 0.01 * delta * x._rotate, x.rz + 0.01 * delta * x._rotate);
    }
  })
  g.drawScene();
}

g.run(setup, draw);

document.addEventListener('palette-change', _colors);