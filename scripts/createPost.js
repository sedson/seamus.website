const fs = require('fs');
const path = require('path');

/**
 * Get a 6 character id for the post.
 */
const uuid = () => {
  const a = Math.random() * (2 ** 12) | 0;
  const b = Math.random() * (2 ** 12) | 0;
  return (a.toString(32) + b.toString(32)).padEnd(6, '0');
}


/**
 * Write a file
 */
const write = (file, content) => {
  const dir = path.dirname(file);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(file, content);
  console.log('Wrote ' + file);
}



const ID = uuid();
const arg = process.argv.slice(2);
const timestamp = new Date(arg[1] || undefined);
const post = `
---
id: ${ID}
timestamp: ${timestamp}
title: ${arg[0] || 'New Post'}
tags:
publish: true
---`.trim();

write(`source/feed/${ID}.txt`, post);