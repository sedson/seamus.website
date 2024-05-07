/**
 * @file Convert a text file into an intermediate form that can be passed 
 * to a template tool. The input format is limited that sort of 
 * combines a yaml front matter with a very simple markdown-ish body.
 */
module.exports = parseContent;


/**
 * Parsing is defined by these flags.
 */
const flags = {
  dataBlock: '---', // Start and end a metadata block 
  keyValue: ':', // Key-value delimiter
  class: '@', // Class name delim
  classList: '.', // Class list separator
  comment: '//', // Comment block

  inline: { // Wrap inline tags
    '~': 'em.open.close',
    '*': 'strong.open.close',
    '%': 'span.open.close',
    '[': 'a.open',
    ']': 'a.close',
  },

  block: { // Start block elements
    '#': 'h1',
    '##': 'h2',
    '###': 'h3',
    '####': 'h4',
    '-': 'li',
    '"': 'blockquote',
    '|': 'div',
  },

  macro: { // Macros for custom behaviors.
    'IMG': 'img',
    'DUO': 'dimg',
    'DUO-k': 'kdimg',
    'div': 'div.open',
    '/div': 'div.close',
    'ol': 'ol.open',
    '/ol': 'ol.close',
    'ul': 'ul.open',
    '/ul': 'ul.close',
    '$': 'escape',
  },

  isInline: (x) => flags.inline[x] ? true : false,
  isBlock: (x) => flags.block[x] ? true : false,
  isMacro: (x) => flags.macro[x] ? true : false,
  isClass: (x) => x && x[0] === flags.class,
}


/**
 * Parse a text file to an intermediate data representation.
 * @param {string} text The text contents of a file. 
 * @returns {object} A document tree that can be templated to a web page.
 */
function parseContent(text) {
  const document = { content: [], mode: 'CONTENT' };
  const lines = text.split('\n');
  lines.forEach(line => parseLine(line, document));
  delete document.mode;
  delete document.currentItem;
  // console.log(JSON.stringify(document, null, 2));
  return document;
}


/**
 * Parse one line.
 * @param {string} line The text contents of a file. 
 * @param {object} document The document object to add content or meta data to.
 * @returns 
 */
function parseLine(line, document) {
  if (line.startsWith(flags.dataBlock)) {
    document.mode = (document.mode === 'CONTENT') ? 'DATA' : 'CONTENT';
    return;
  }

  if (document.mode === 'DATA') {
    const tokens = line.split(flags.keyValue);
    const key = tokens[0].trim();
    document[key] = tokens.slice(1).join(':').trim();
    return;
  }

  if (!line.length) return;
  if (line.startsWith(flags.comment)) return;

  const tokens = line.split(/\s/g);

  const node = { type: 'p', content: [] };

  if (flags.isMacro(tokens[0])) {
    node.macro = flags.macro[tokens[0]];
    tokens.shift();
  }

  if (flags.isBlock(tokens[0])) {
    node.type = flags.block[tokens[0]];
    tokens.shift();
  }

  if (flags.isClass(tokens[0])) {
    node.classList = tokens[0].slice(1).split(flags.classList);
    tokens.shift();
  }

  parseTextContent(tokens, node);

  if (node.content) {
    document.content.push(node);
  }
}


/**
 * Parse the text content into the node.
 * @param {array<string>} tokens The tokens of the node
 * @param {object} node The node data structure to parse into.
 */
function parseTextContent(tokens, node) {
  const inline = Object.entries(flags.inline);

  // The current receiver for text content. As the loop scans the tokens looking
  // for control flags it adds either text leaves or other inline type leaves 
  // to the node's content array.
  let current = { content: '', type: 'text' };

  for (let token of tokens) {
    let consumed = false;
    let suffix = ' ';

    for (let symbol of ['.', ',']) {
      if (token.endsWith(symbol)) {
        token = token.slice(0, -1);
        suffix = symbol + ' ';
      }
    }

    for (let [flag, type] of inline) {

      if (token.startsWith(flag) && type.includes('open')) {
        consumed = true;
        node.content.push(current);

        token = token.slice(flag.length);


        current = {
          type: type.split('.')[0],
          content: token
        };

      }

      if (token.endsWith(flag) && type.includes('close')) {
        // console.log({ token })

        if (consumed) {
          current.content = token.slice(0, -flag.length);
        } else {
          current.content += token.slice(0, -flag.length);
        }
        consumed = true;
        node.content.push(current);
        current = { content: suffix, type: 'text' };
      } else {
        if (consumed) current.content += suffix;
      }
    }

    if (!consumed) {
      current.content += token + suffix;
    }
  }
  node.content.push(current);
}