/**
 * @file Build seamus.website.
 */

const fs = require('fs');
const path = require('path');
const parseContent = require('./parseContent');
const flattenContent = require('./flattenContent');
const compileTemplate = require('./compileTemplate');
const widgets = require('./createWidgets');

/**
 * The cached template. So I don't load or compile them so many times.
 */
const _templates = {};


/**
 * Read a content file and flatten the content to html.
 * @param {string} file The path to read.
 * @returns {object} A document that can be passed to a template function.
 */
const get = (path) => {
  const file = fs.readFileSync(path, 'utf8');
  const doc = parseContent(file);
  doc.content = flattenContent(doc.content);
  return doc;
}


/**
 * Write a file.
 * @param {string} file The path to write.
 * @param {string} content The stuff to write.
 */
const write = (file, content) => {
  const dir = path.dirname(file);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(file, content);
  console.log('Wrote ' + file);
}


/**
 * Load and compile a template.
 * @param {string} file 
 * @returns 
 */
const template = (file) => {
  if (!_templates[file]) {
    const template = fs.readFileSync(`templates/${file}.template.html`, 'utf8');
    _templates[file] = compileTemplate(template);
  }
  return _templates[file];
}



/**
 * Get a date, nicely formatted.
 * @param {string} file
 * @returns {String}
 */
const getDateFormat = (selectedDate) => {
  let date = selectedDate ? selectedDate : new Date();
  return date.toLocaleDateString(undefined, { year: 'numeric', month: 'numeric', day: 'numeric' });
}


/**
 * Get the navigation bread crumb for a particular path.
 */
const getNav = (link) => {
  if (!link) return;
  let out = ''
  let href = '/';
  const parts = link.split('/');
  for (let i = 0; i < parts.length; i++) {
    const text = parts[i];
    const terminal = i === parts.length - 1;
    if (terminal) {
      out += `<span>→</span><span class="terminal">${text}</span>`;
    } else {
      href += text + '/';
      out += template('breadcrumb')({ href, text });
    }
  }
  return out;
}


/**
 * Build the site.
 * @returns 
 */
function main() {

  console.time('main');
  const date = getDateFormat();

  const t_page = ctx => {
    return template('main')({ ...ctx, date });
  }
  const t_header = (ctx) => {
    return template('header')({ ...ctx, ...widgets });
  }
  const t_footer = template('footer');
  const t_homePage = template('homepage');

  // Header and footer are statics.
  const footer = t_footer({ date });
  const contact = template('contact')

  // Loop over all the projects in source and make pages.
  let projects = [];
  let selectedProjects = [];
  let projectList = fs.readdirSync('source/projects');
  let selectedIndex = 1;

  for (let file of projectList) {

    let slug = file.split('.')[0];
    let project = get('source/projects/' + file);

    // Projects with publish = true get their own page.
    if (project.publish === 'true' && !project.link) {
      project.link = '/projects/' + slug;
    }

    projects.push(project);
    project.tag = 'a';

    // Just div if not set to publish.
    if (project.publish !== 'true') {
      project.classList = 'inactive';
      project.tag = 'div';
    }

    write('www/projects/' + slug + '/index.html', t_page({
      header: t_header({ nav: getNav('projects/' + slug) }),
      footer,
      date,
      title: project.title,
      body: template('projectpage')(project)
    }));

    if (project.selected === 'true') {
      selectedIndex++;
      selectedProjects.push(project);
    }
  }

  const projectSort = (a, b) => {
    return Number(b.year.split('–')[0]) - Number(a.year.split('–')[0]);
  }
  // Sort the projects by year.
  projects = projects
    .sort(projectSort)
    .map(a => template('projectrow')(a))
    .join('\n');

  selectedProjects = selectedProjects
    .sort(projectSort)
    .map((a, i) => {
      return template('projectcard')({ ...a, index: i + 1 });
    })
    .join('\n');

  // ----------------------------------
  // HOME
  // ----------------------------------
  write('www/index.html', t_page({
    header: t_header(),
    footer,
    title: 'Seamus Edson',
    body: template('homepage')({
      content: get('source/home.txt').content,
      projects: selectedProjects,
    }),
  }));

  // ----------------------------------
  // PROJECTS
  // ----------------------------------
  write('www/projects/index.html', t_page({
    header: t_header({ nav: getNav('projects') }),
    footer,
    title: 'Seamus Edson',
    body: template('projects')({
      selected: selectedProjects,
      projects,
    })
  }));


  // ----------------------------------
  // The plain text default pages
  // ----------------------------------
  const plainPages = [
    ['About', get('source/about.txt').content],
  ];



  for (let p of plainPages) {
    const pageLc = p[0].toLowerCase();
    write(`www/${pageLc}/index.html`, t_page({
      header: t_header({ nav: getNav(pageLc) }),
      footer,
      title: `Seamus Edson - ${p[0]}`,
      body: template('page')({
        content: p[1]
      }),
    }));
  }

  // ----------------------------------
  // Sketchbook
  // ----------------------------------
  const folders = fs.readdirSync('www/img/sketchbook')
    .filter(x => x[0] !== '.'); // Filter out .DS_Store

  const seasons = ['spring', 'summer', 'fall', 'winter'];

  folders.sort((a, b) => {
    let [aSeason, aYear] = a.split('_');
    let [bSeason, bYear] = b.split('_');
    aYear = aYear.split('-')[0];
    bYear = bYear.split('-')[0];
    const yearSort = bYear - aYear;
    const seasonSort = (seasons.indexOf(bSeason) - seasons.indexOf(aSeason)) / 10;
    return yearSort + seasonSort;
  });

  const groups = folders.map(dir => {
    const files = fs.readdirSync(`www/img/sketchbook/${dir}`)
      .filter((x, i) => x[0] !== '.');

    const images = files.map(file => {
      return template('sketchbook-image')({ file, url: `/img/sketchbook/${dir}/${file}` });
    });

    const links = files.map((_, i) => {
      return `<li>${i}</li>`;
    }).join('\n');

    return template('sketchbook-collection')({
      images: images.join('\n'),
      count: images.length,
      links: links,
      folder: dir,
      img: `/img/sketchbook/${dir}/${files[0]}`,
      arrow: widgets.arrow,
    });
  });


  write('www/sketchbook/index.html', t_page({
    header: t_header({ nav: getNav('sketchbook') }),
    footer,
    title: 'Seamus Edson - Sketchbook',
    body: template('sketchbook')({
      content: groups.join('\n'),
    }),
  }));



  // Loop over all the projects in source and make pages.
  let posts = [];
  let postsJson = {};
  let postList = fs.readdirSync('source/feed');



  for (let fileName of postList) {

    let slug = fileName.split('.')[0];
    let post = get('source/feed/' + fileName);
    if (post.publish === 'false') {
      continue;
    }
    const date = (new Date(post.timestamp)).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    post.date = date;

    postsJson[post.id] = post;

    const postMarkup = template('post')(post);
    posts.push(postMarkup);
  }

  write('www/feed/posts.json', JSON.stringify(postsJson, null, 2));

  // ----------------------------------
  // FEED
  // ----------------------------------
  write('www/feed/index.html', t_page({
    header: t_header({ nav: getNav('feed') }),
    footer,
    title: 'Seamus Edson - Feed',
    body: template('feed')({ posts: posts.join('\n'), ...widgets }),
  }));

  // ----------------------------------
  // COLOPHON
  // ----------------------------------
  let log = fs.readFileSync('log.txt', 'utf8');
  log = log.split('\n').slice(0, 3).join('\n');
  log = parseContent(log);
  log = flattenContent(log.content);


  write('www/colophon/index.html', t_page({
    header: t_header({ nav: getNav('colophon') }),
    footer,
    title: 'Seamus Edson - Colophon',
    body: template('colophon')({
      content: get('source/colophon.txt').content,
      log
    })
  }));

  console.timeEnd('main');

}

main();