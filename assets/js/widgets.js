import { SVG } from './svg.js';


// 
const w1 = new SVG(18, 18);
const style = {
  'stroke-width': '1',
  'stroke': 'var(--current-fg)',
  'fill': 'none',
  'vector-effect': 'non-scaling-stroke',
};

w1.path([
  [6, 0],
  [0, 18]
], style);

w1.path([
  [12, 0],
  [0, 18]
], style);

w1.path([
  [0, 6],
  [18, 0]
], style);

w1.path([
  [0, 12],
  [18, 0]
], style);


console.log(w1.root.outerHTML);
document.body.append(w1.root);


const w2 = new SVG(18, 18);
const style2 = {
  'stroke-width': '0',
  'fill': 'var(--current-fg)',
  'vector-effect': 'non-scaling-stroke',
};

w2.ellipse(9, 9, 2, 2, style2);
w2.ellipse(4, 4, 2, 2, style2);
w2.ellipse(4, 14, 2, 2, style2);
w2.ellipse(14, 14, 2, 2, style2);
w2.ellipse(14, 4, 2, 2, style2);

console.log(w2.root.outerHTML);
document.body.append(w2.root);



const w3 = new SVG(18, 18);

w3.path([
  [0, 0],
  [18, 18]
], style);
w3.ellipse(9, 9, 6, 6, style);

console.log(w3.root.outerHTML);
document.body.append(w3.root);

const w4 = new SVG(18, 18);

w4.path([
  [9, 3],
  [0, 12]
], style);

w4.path([
  [3, 9],
  [12, 0]
], style);

w4.path([
  [5, 5],
  [13, 13]
], style, false);
w4.path([
  [5, 13],
  [13, 5]
], style, false);

console.log(w4.root.outerHTML);
document.body.append(w4.root);