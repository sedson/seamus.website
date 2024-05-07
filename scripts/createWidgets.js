const SVG = require('./svgOffline.js');


/**
 * Toggle grid. Looks like a hash.
 */
function toggleGrid() {
  const svg = new SVG(18, 18);
  const style = {
    'stroke-width': '1',
    'stroke': 'var(--text-color)',
    'fill': 'none',
    'vector-effect': 'non-scaling-stroke',
  };
  svg.path([[6, 0], [0, 18]], style);
  svg.path([[12, 0], [0, 18]], style);
  svg.path([[0, 6], [18, 0]], style);
  svg.path([[0, 12], [18, 0]], style);
  return svg.root.render();
}


/**
 * Swap colors. A cirle with a diagonal line through it.
 */
function swapColors() {
  const svg = new SVG(18, 18);
  const style = {
    'stroke-width': '1',
    'stroke': 'var(--text-color)',
    'fill': 'none',
    'vector-effect': 'non-scaling-stroke',
  };
  svg.path([[2, 2], [14, 14]], style);
  svg.ellipse(9, 9, 5, 5, style);
  return svg.root.render();
}


/**
 * Random colors. Like a little dice face.
 */
function randomColors() {
  const svg = new SVG(18, 18);
  const style = {
    'stroke-width': '0',
    'fill': 'var(--text-color)',
    'vector-effect': 'non-scaling-stroke',
  };
  svg.ellipse(9, 9, 2, 2, style);
  svg.ellipse(4, 4, 2, 2, style);
  svg.ellipse(4, 14, 2, 2, style);
  svg.ellipse(14, 14, 2, 2, style);
  svg.ellipse(14, 4, 2, 2, style);
  return svg.root.render();
}


/**
 * Reset colors. Like an asterisk.
 */
function resetColors() {
  const svg = new SVG(18, 18);
  const style = {
    'stroke-width': '1',
    'stroke': 'var(--text-color)',
    'fill': 'none',
    'vector-effect': 'non-scaling-stroke',
  };
  svg.path([[9, 3], [0, 12]], style);
  svg.path([[3, 9], [12, 0]], style);
  svg.path([[5, 5], [13, 13]], style, false);
  svg.path([[5, 13], [13, 5]], style, false);
  return svg.root.render();
}

function home() {
  const svg = new SVG(18, 18);
  const pts = [];
  const style = {
    'fill': 'var(--text-color)',
    'vector-effect': 'non-scaling-stroke',
  };

  svg.ellipse(9, 9, 7, 7, style);

  return svg.root.render();
}

function arrow() {
  const svg = new SVG(18, 18);
  const style = {
    'stroke-width': '2',
    'stroke': 'var(--page-color)',
    'fill': 'none',
    'stroke-linecap': 'round',
  };
  svg.path([[2, 9], [12, 0]], style);
  svg.path([[14, 9], [-5, -5]], style);
  svg.path([[14, 9], [-5, 5]], style);

  style.stroke = 'var(--text-color)';
  style['stroke-width'] = '1';
  svg.path([[2, 9], [12, 0]], style);
  svg.path([[14, 9], [-5, -5]], style);
  svg.path([[14, 9], [-5, 5]], style);
  return svg.root.render();
}

function close() {
  const svg = new SVG(18, 18);
  const style = {
    'stroke-width': '1',
    'stroke': 'var(--text-color)',
    'fill': 'none',
    'stroke-linecap': 'round',
  };
  svg.path([[2, 2], [16, 16]], style, false);
  svg.path([[2, 16], [16, 2]], style, false);
  return svg.root.render();
}


module.exports = {
  toggleGrid: toggleGrid(),
  randomColors: randomColors(),
  swapColors: swapColors(),
  resetColors: resetColors(),
  home: home(),
  arrow: arrow(),
  close: close(),
};