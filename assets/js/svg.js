/**
 * @file Provide some light utility for making SVGs from script.
 */


/**
 * Create an SVG element.
 */
function createSvgElement(type = 'svg') {

  return document.createElementNS('http://www.w3.org/2000/svg', type);
}

/**
 * Create an SVG root element.
 */
function svgRoot(w, h) {
  const elem = createSvgElement('svg');
  attr(elem, {
    'xmlns': 'http://www.w3.org/2000/svg',
    'width': w,
    'height': h,
    'viewBox': `0 0 ${w} ${h}`
  });
  return elem;
}


/**
 * Apply a bag of attributes to an SVG.
 */
function attr(target, attributes) {
  for (let attrib in attributes) {
    target.setAttribute(attrib, attributes[attrib]);
  }
}

/**
 * Get an SVG past form a list of points. [[0, 0], [0, 1]]
 */
function makePathRel(pts, closed = false) {
  let str = 'm ' + pts[0][0] + ',' + pts[0][1] + ' l ';
  for (let i = 1; i < pts.length; i++) {
    str += pts[i][0] + ',' + pts[i][1] + ' ';
  }
  if (closed) str += ' z';
  return str;
}

/**
 * Get an SVG past form a list of points. [[0, 0], [0, 1]]
 */
function makePathAbs(pts, closed = false) {
  let str = 'M ' + pts[0][0] + ',' + pts[0][1] + ' L ';
  for (let i = 1; i < pts.length; i++) {
    str += pts[i][0] + ',' + pts[i][1] + ' ';
  }
  if (closed) str += ' z';
  return str;
}



/**
 * Create an SVG rectangle.
 */
function rect(x, y, w, h) {
  const rectangle = createSvgElement('rect');
  attr(rectangle, { x, y, width: w, height: h });
  return rectangle;
}

/**
 * Create an SVG rectangle.
 */
function ellipse(x, y, w, h) {
  const ellipse = createSvgElement('ellipse');
  attr(ellipse, { cx: x, cy: y, rx: w, ry: h });
  return ellipse;
}

/**
 * Create an SVG path.
 */
function path(d) {
  const path = createSvgElement('path');
  attr(path, { d });
  return path;
}

/**
 * Create an SVG group.
 */
function group() {
  return createSvgElement('g');
}


export class SVG {
  constructor(w, h) {
    this.root = svgRoot(w, h);
  }

  ellipse(x, y, w, h, attrs = {}) {
    const e = ellipse(x, y, w, h);
    attr(e, attrs);
    this.root.appendChild(e);
    return e;
  }

  path(pts, attrs = {}, rel = true, closed = false) {
    const d = rel ? makePathRel(pts, closed) : makePathAbs(pts, closed);
    const e = path(d);
    attr(e, attrs);
    this.root.appendChild(e);
    return e;
  }

  rect(x, y, w, h, attrs = {}) {
    const e = rect(x, y, w, h);
    attr(e, attrs);
    this.root.appendChild(e);
    return e;
  }
}