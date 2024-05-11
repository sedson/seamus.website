import { SVG } from './svg.js';

const clock = document.createElement('div');

const strokeWeight = 1;

clock.classList.add('clock', 'width-1');


Object.assign(clock.style, {
  borderRadius: '0.5rem',
  position: 'fixed',
  bottom: 'var(--body-pad)',
  right: 'var(--body-pad)',
  display: 'flex',
  pointerEvents: 'none',
  zIndex: 20,
});

const clockSvg = new SVG(100, 100);
clockSvg.ellipse(50, 50, 48, 48, {
  'stroke-width': strokeWeight,
  'stroke': 'var(--text-color)',
  'fill': 'none',
  'vector-effect': 'non-scaling-stroke',
});

const hrs = clockSvg.path([
  [50, 50],
  [0, -20]
], {
  'stroke-width': strokeWeight,
  'stroke': 'var(--text-color)',
  'stroke-linecap': 'round',
  'fill': 'none',
  'vector-effect': 'non-scaling-stroke',
});

const mns = clockSvg.path([
  [50, 50],
  [0, -30]
], {
  'stroke-width': strokeWeight,
  'stroke': 'var(--text-color)',
  'stroke-linecap': 'round',
  'fill': 'none',
  'vector-effect': 'non-scaling-stroke',
});

const scs = clockSvg.path([
  [50, 50],
  [0, -40]
], {
  'stroke-width': strokeWeight,
  'stroke': 'var(--text-color)',
  'stroke-linecap': 'round',
  'fill': 'none',
  'vector-effect': 'non-scaling-stroke',
});


Object.assign(clockSvg.root.style, {
  width: '100%',
  height: '100%',
});


function tick() {
  let date = new Date();
  let hours = date.getHours();
  let minutes = date.getMinutes();
  let seconds = date.getSeconds();
  hrs.setAttribute('transform', `rotate(${(hours / 12 + (minutes / 60 / 12)) * 360}, 50, 50)`)
  mns.setAttribute('transform', `rotate(${minutes / 60 * 360}, 50, 50)`)
  scs.setAttribute('transform', `rotate(${seconds / 60 * 360}, 50, 50)`)
  requestAnimationFrame(tick)
};

tick();
document.body.append(clock);
clock.append(clockSvg.root);