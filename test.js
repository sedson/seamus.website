const fs = require('fs');
const parseContent = require('./scripts/parseContent');
const flattenContent = require('./scripts/flattenContent');


const get = (path) => {
  const file = fs.readFileSync(path, 'utf8');
  const doc = parseContent(file);
  console.log(JSON.stringify(doc, null, 1));
  return doc;
}

console.log(get('./source/about.txt'))