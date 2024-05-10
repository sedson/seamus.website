/**
 * @file Flatten an array of content bits into one html string
 */
module.exports = flattenContent;


/**
 * Put custom extensions in.
 */
const macros = {
  'img': (item) => {
    let parts = item.content[0].content.split(' ');
    let href = parts[0];
    let altText = parts.slice(1).join(' ');
    return `<img ${toClass(item)} src="${href}" alt="${altText}">\n`;
  },
  'dimg': (item) => {
    let parts = item.content[0].content.split(' ');
    let href = parts[0];
    let altText = parts.slice(1).join(' ');
    return `<duotone-image ${toClass(item)} src="${href}" alt="${altText}"></duotone-image>\n`;
  },
  'kdimg': (item) => {
    let parts = item.content[0].content.split(' ');
    let href = parts[0];
    let altText = parts.slice(1).join(' ');
    return `<duotone-image ${toClass(item)} src="${href}" alt="${altText}" maintain-brightness="true"></duotone-image>\n`;
  },
  'div.open': (item) => {
    return `<div ${toClass(item)}>\n`;
  },
  'div.close': (item) => {
    return `</div>\n`;
  },
  'ol.open': (item) => {
    return `<ol ${toClass(item)} >\n`;
  },
  'ol.close': (item) => {
    return `</ol>\n`;
  },
  'ul.open': (item) => {
    return `<ul ${toClass(item)} >\n`;
  },
  'ul.close': (item) => {
    return `</ul>\n`;
  },
  'escape': (item) => {
    // TODO : flatten content?
    return item.content[0].content + '\n';
  }
};

function flattenContent(items) {
  let html = '';

  for (let item of items) {

    if (item.macro && macros[item.macro]) {
      html += macros[item.macro](item);
      continue;
    }

    html += renderItem(item);

  }
  return html;
}


/**
 * Render one block level item.
 * @param {*} item 
 */
function renderItem(item) {
  let str = '';
  const { type, content } = item;
  str += `<${type}${toClass(item)}>`;

  for (let c of content) {
    switch (c.type) {
    case 'text':
      str += c.content;
      break;

    case 'a':
      let tokens = c.content.split('-');
      const linkText = tokens[0];
      const href = tokens.slice(1).join('-').trim();

      str += `<a href="${href}"${toClass(href)}>${linkText}</a>`;
      break;

    default:
      str += `<${c.type}>${c.content}</${c.type}>`;
    }
  }
  str += `</${type}>\n`;
  return str;
}


function toClass(item) {
  if (typeof item === 'string' && item.indexOf('http') > -1) {
    return ' class="external"'
  }
  if (!item.classList) return '';
  return ' class="' + item.classList.join(' ') + '"';
}