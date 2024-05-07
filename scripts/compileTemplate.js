/**
 * @file Parse and compile a template into a callable function that renders 
 * that template. Credit to shadowtime2000 for most of this.
 */
module.exports = compileTemplate;


/**
 * Convert a text form template into the function that renders that template.
 * 
 */
function compileTemplate(text) {
  return toFunction(parseText(text));
}


/**
 * Parse a template string into an array of items where each item is either 
 * plain text to be concatenated or a variable name to be extracted when the 
 * template is rendered. Borrowed from EJS.
 * @param {string} template The original template string. 
 * @returns {array<string>}
 */
function parseText(template) {
  const pattern = '{{(.*?)}}';
  const output = [];

  let match = new RegExp(pattern, 'g').exec(template);
  let index;

  while (match) {
    index = match.index;

    if (index !== 0) {
      output.push(template.substring(0, index));
      template = template.slice(index);
    }

    output.push(match[0]);

    template = template.slice(match[0].length);
    match = new RegExp(pattern, 'g').exec(template);
  }

  if (template) output.push(template);
  return output;
}


/**
 * Turn a list of strings into a function that can render a template using 
 * string concatenation.
 * @param {array<string>} template The original template string. 
 * @returns {function}
 */
function toFunction(tokens) {
  // Replace the identifier characters.
  const clean = str => str.replaceAll(/{|}/g, '').trim();

  // Only include items that are defined in the data context.
  const verifier = str => `(data['${str}'] ? data['${str}'] : '')`;

  const escapeReturn = str => str.replaceAll('\n', `'+ '\\n' + '`);
  const escapeQuote = str => str.replaceAll(`'`, `\'`);

  let strings = [`data = data || {};`, `return ''`];

  for (let token of tokens) {
    if (token.startsWith('{{') && token.endsWith('}}')) {
      strings.push('+' + verifier(clean(token)));
    } else {
      strings.push(`+'` + escapeQuote(escapeReturn(token)) + `'`);
    }
  }
  const fn = strings.join('');
  return new Function('data', fn);
}