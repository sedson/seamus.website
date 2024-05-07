import { SVG } from './svg.js';
const { sin, cos, PI, random, pow } = Math;

console.log(SVG)
const flower = document.createElement('div');
flower.classList.add('flower', 'width-6');

const svg = new SVG(600, 100);
flower.append(svg.root);
Object.assign(svg.root.style, {
  width: '100%',
  height: '100%',
});

document.body.prepend(flower);


const stroke = {
  'stroke-width': '1',
  'stroke': 'var(--current-fg)',
  'fill': 'none',
  'vector-effect': 'non-scaling-stroke',
  'stroke-linecap': 'round',
  'stroke-linejoin': 'round',
};

const debug = {
  'stroke-width': '1',
  'stroke': 'yellow',
  'fill': 'none',
  'vector-effect': 'non-scaling-stroke',
  'stroke-linecap': 'round',
  'stroke-linejoin': 'round',
};
const fill = {
  'fill': 'var(--current-fg)',
  'stroke': 'none',
};

const perturb = (pt, amt = 0) => {
  pt[0] += (Math.random() * 2 - 1) * amt;
  pt[1] += (Math.random() * 2 - 1) * amt;
  return pt;
}

function l(cx, cy, s, angle, len, r) {
  const xOff = Math.cos(angle) * s;
  const yOff = Math.sin(angle) * s;

  const pts = [[cx, cy]];
  for (let i = 0; i < len; i++) {
    pts.push(perturb([xOff, yOff], s * r));
  }

  svg.path(pts, stroke);
}

function lerp(a, b, t) {
  return [a[0] + t * (b[0] - a[0]), a[1] + t * (b[1] - a[1])];
}


function cubicBezier(a, b, c, res) {
  const points = [];
  for (let i = 0; i < res; i++) {
    const t = i / (res - 1);
    const ab = lerp(a, b, t);
    const bc = lerp(b, c, t);
    points.push(lerp(ab, bc, t));
  }
  return points;
}


function burst(cx, cy, s, count, sharpness = 0) {
  const pts = [];
  for (let i = 0; i < count; i++) {
    const a = Math.PI * 2 * i / (count);
    pts.push([cx + cos(a) * s, cy + sin(a) * s]);
  }

  // pts.map(x => perturb(x, 5));
  const r = random() * 900;

  const pts2 = [];
  for (let i = 0; i < count; i++) {

    const a1 = Math.PI * 2 * (i + 0.0) / count;
    const a2 = Math.PI * 2 * (i + 0.5) / count;
    const a3 = Math.PI * 2 * (i + 1.0) / count;

    const r1 = (cos(r + 5 * a1) + 1) / 2;
    const r3 = (cos(r + 5 * a3) + 1) / 2;


    const p1 = [cx + cos(a1) * s, cy + sin(a1) * s];
    const p3 = [cx + cos(a3) * s, cy + sin(a3) * s];

    const p2 = lerp(lerp(p1, p3, 0.5), [cx, cy], sharpness);

    const pts = [p1, p2, p3];
    // svg.path(pts, debug, false, false)

    const curve = cubicBezier(p1, p2, p3, 10);

    svg.path(curve, stroke, false, false);

  }
}


function rot(count, fn) {
  for (let i = 0; i < count; i++) {
    const angle = 2 * Math.PI * i / (count);
    fn(angle);
  }
}


function generate() {
  svg.root.innerHTML = '';

  rot(18, a => {
    l(50, 50, Math.random() * 2 + 2, a, 10, 0.1)
  })

  burst(150, 50, 40, 18, 0.7)
}

flower.onclick = () => generate();
generate();