/**
 * @file Build seamus.website.
 */


const fs              = require('fs');
const parseContent    = require('./scripts/parseContent');
const flattenContent  = require('./scripts/flattenContent');
const compileTemplate = require('./scripts/compileTemplate');


/**
 * Read a file.
 * @param {string} file File pointer.
 * @returns {string} The contents.
 */
const read = file => fs.readFileSync(file, 'utf8');


/**
 * Read a content file and flatten the content to html.
 * @param {string} file The path to read.
 * @returns {object} A document that can be passed to a template function.
 */
const get = file => {
  let doc = parseContent(read(file));
  doc.content = flattenContent(doc.content);
  return doc;
}


/**
 * Write a file.
 * @param {string} file The path to write.
 * @param {string} content The stuff to write.
 */
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


/**
 * Get a date, nicely formatted.
 * @param {string} file
 * @returns {String}
 */
const getDateFormat = (date) => {
  if (!date) {
    date = new Date();
  }
  const format = { year: 'numeric', month: 'long', day: 'numeric' };
  return date.toLocaleDateString(undefined, format);
}


/**
 * Build the site.
 * @returns 
 */
(function main () {

  console.time('main');
  
  const t_page        = template('templates/main.template.html');
  const t_header      = template('templates/header.template.html');
  const t_footer      = template('templates/footer.template.html');
  const t_homePage    = template('templates/homepage.template.html');
  const t_projectPage = template('templates/projectpage.template.html');
  const t_projectCard = template('templates/projectcard.template.html');
  const t_post        = template('templates/post.template.html');
  const t_feed        = template('templates/feed.template.html');
  
  // Header and footer are static.
  const date = getDateFormat();
  const footer = t_footer({ date });
  const header = t_header();
  
  const bio = get('source/bio.txt');

  // Loop over all the projects in source and make pages.
  let projects = [];
  let projectList = fs.readdirSync('source/projects');
  
  for (let file of projectList) {

    let slug = file.split('.')[0];
    let project = get('source/projects/' + file);

    // Projects with publish = true get their own page.
    if (project.publish === 'true' && !project.link) {
      project.link = '/' + slug;
    }


    projects.push(project);

    // Make a folder if needed.
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

  // Sort the projects by year.
  projects = projects
    .sort((a, b) => Number(b.year) - Number(a.year))
    .map(a => t_projectCard(a))
    .join('\n');


  // ----------------------------------
  // HOME
  // ----------------------------------
  write('www/index.html', t_page({
    header,
    footer,
    title: 'Seamus Edson',
    body: t_homePage({
      projects: projects
    })
  }));

  // ----------------------------------
  // PROJECTS
  // ----------------------------------
  write('www/projects/index.html', t_page({
    header, 
    footer,
    title: 'Seamus Edson',
    body: projects,
  }));

  // ----------------------------------
  // INFO
  // ----------------------------------
  write('www/info/index.html', t_page({
    header,
    footer,
    title: 'Seamus Edson',
    body: bio.content,
  }));

  // ----------------------------------
  // FEED
  // ----------------------------------
  const feedFiles = fs.readdirSync('www/img/feed/');
  const posts = [];

  let index = feedFiles.length;

  for (let file of feedFiles) {
    const stats = fs.statSync('www/img/feed/' + file);
    const postDate = getDateFormat(stats.birthtime);
    posts.push(t_post({
      index,
      src: '/img/feed/' + file,
      filename: file,
      date: postDate,
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
})();