/**
 * @file Build seamus.website.
 */
const fs = require('fs');
const parseContent = require('./scripts/parseContent');
const flattenContent = require('./scripts/flattenContent');
const compileTemplate = require('./scripts/compileTemplate');

/**
 * Read a file.
 * @param {string} file File pointer.
 * @returns {string} The contents.
 */
const read = file => fs.readFileSync(file, 'utf8');


/**
 * Get a content (markdown-like) file with the contents pre-flattened into 
 * the key content.
 * @param {string} file File pointer.
 * @returns {object} A document that can be passed to a template function.
 */
const get = file => {
  let doc = parseContent(read(file));
  doc.content = flattenContent(doc.content);
  return doc;
}

const write = (file, content) => {
  fs.writeFileSync(file, content);
  console.log('Wrote ' + file);
}


/**
 * Load and compile a template.
 * @param {string} file 
 * @returns 
 */
const template = file => compileTemplate(read(file));


const getDateFormat = (date = new Date()) => {
  const format = {
    year: 'numeric', month: 'long', day: 'numeric'
  };
  return date.toLocaleDateString(undefined, format);
}

/**
 * Build the site.
 * @returns 
 */
function main () {
  console.time('main');

  const t_page        = template('templates/main.template.html');
  const t_header      = template('templates/header.template.html');
  const t_footer      = template('templates/footer.template.html');
  const t_homePage    = template('templates/homepage.template.html');
  const t_projectPage = template('templates/projectpage.template.html');
  const t_projectCard = template('templates/projectcard.template.html');
  const t_post        = template('templates/post.template.html');
  const t_feed        = template('templates/feed.template.html');
  
  const date = getDateFormat();
  
  // Header and footer are static.
  const footer = t_footer({ date });
  const header = t_header();
  
  const bio = get('source/bio.txt');


  let projectList = [];
  let projects = fs.readdirSync('source/projects');

  for (let file of projects) {

    let slug = file.split('.')[0];
    let project = get('source/projects/' + file);

    if (project.publish === 'true') {
      project.link = '/' + slug;
    }
    projectList.push(project);


    if (!fs.existsSync('www/' + slug)) {
      fs.mkdirSync('www/' + slug);
    }

    write('www/' + slug + '/index.html', t_page({
      header,
      footer, 
      title: project.title,
      body: t_projectPage(project)
    }));
  }

  projectList = projectList
    .sort((a, b) => Number(b.year) - Number(a.year))
    .map(a => t_projectCard(a))
    .join('\n');


  write('www/index.html', t_page({
    header,
    footer,
    title: 'Seamus Edson',
    body: t_homePage({
      projects: projectList
    })
  }));

  write('www/projects/index.html', t_page({
    header, 
    footer,
    title: 'Seamus Edson',
    body: projectList,
  }));

  write('www/info/index.html', t_page({
    header,
    footer,
    title: 'Seamus Edson',
    body: bio.content,
  }));


  const feedFiles = fs.readdirSync('www/img/feed/');
  const posts = [];
  let index = feedFiles.length;
  for (let file of feedFiles) {
    const stats = fs.statSync('www/img/feed/' + file);
    posts.push(t_post({
      index,
      src: '/img/feed/' + file,
      filename: file,
      date: getDateFormat(stats.birthTime)
    }));
    index -= 1;
  }

  write('www/feed/index.html', t_page({ 
    header, 
    footer, 
    title: 'Feed',
    body: t_feed({posts: posts.join('')})
  }));
    
  console.timeEnd('main');
}

main();

