/**
 * @file Provide some light utility for making SVGs from script.
 */

/**
 * Extremely simple tag helper.
 */
class Tag {
  constructor(type, attrs = {}) {
    this.type = type;
    this.children = [];
    this.attrs = attrs;
  }

  append(child) {
    this.children.push(child);
  }

  render() {
    const attrs = Object.entries(this.attrs).map(x => `${x[0]}="${x[1]}"`).join(' ');
    return `<${this.type} ${attrs}>` + this.children.reduce((a, b) => a + b.render(), '') + `</${this.type}>`;
  }
}

/**
 * Create an SVG root element.
 */
function svgRoot(w, h) {
  return new Tag('svg', {
    xmlns: "http://www.w3.org/2000/svg",
    width: w,
    height: h,
    viewBox: `0 0 ${w} ${h}`,
  });
}


/**
 * Apply a bag of attributes to an SVG.
 */
function attr(target, attributes) {
  for (let attrib in attributes) {
    target.attrs[attrib] = attributes[attrib];
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
  const rectangle = new Tag('rect', {});
  attr(rectangle, { x, y, width: w, height: h });
  return rectangle;
}

/**
 * Create an SVG rectangle.
 */
function ellipse(x, y, w, h) {
  const ellipse = new Tag('ellipse', {});
  attr(ellipse, { cx: x, cy: y, rx: w, ry: h });
  return ellipse;
}

/**
 * Create an SVG path.
 */
function path(d) {
  const path = new Tag('path', {});
  attr(path, { d });
  return path;
}

/**
 * Create an SVG group.
 */
function group() {
  return new Tag('g', {});
}


class SVG {
  constructor(w, h) {
    this.root = svgRoot(w, h);
  }

  ellipse(x, y, w, h, attrs = {}) {
    const e = ellipse(x, y, w, h);
    attr(e, attrs);
    this.root.append(e);
    return e;
  }

  path(pts, attrs = {}, rel = true, closed = false) {
    const d = rel ? makePathRel(pts, closed) : makePathAbs(pts, closed);
    const e = path(d);
    attr(e, attrs);
    this.root.append(e);
    return e;
  }

  rect(x, y, w, h, attrs = {}) {
    const e = rect(x, y, w, h);
    attr(e, attrs);
    this.root.append(e);
    return e;
  }
}

module.exports = SVG;