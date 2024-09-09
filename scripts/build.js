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
 * The date of this build.
 */
const date = getDateFormat();


/**
 * 
 */
const statics = {
  footer: template('footer')({ date }),
};


/**
 * Read a content file and flatten the content to html.
 * @param {string} file The path to read.
 * @returns {object} A document that can be passed to a template function.
 */
function get(path) {
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
function write(file, content) {
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
function template(file) {
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
function getDateFormat(selectedDate) {
  let date = selectedDate ?? new Date();
  return date.toISOString().split('T')[0];
}


/**
 * Get a numeric sort value from a string like 'spring_2024' or 
 * 'winter_2022-2023'. In this case for sorting the sketchbook folders 
 * chronologically.
 * @param {string} str The season_year string
 * @returns {number}
 */
function seasonYearToSortValue(str) {
  const seasons = ['spring', 'summer', 'fall', 'winter'];
  const [season, year] = str.split('_');
  return Number.parseInt(year) + seasons.indexOf(season) / 4;
}


/**
 * Get the navigation bread crumb for a particular path.
 * @param {string} link
 */
function getNav(link) {
  if (!link) return;
  let out = '';
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
 * Build the header
 */
function header(ctx) {
  return template('header')({ ...ctx, ...widgets });
}


function page(ctx) {
  return template('main')({ date, ...statics, ...ctx });
}


function fetchProjects() {
  let projectList = fs.readdirSync('source/projects');
  let projects = [];
  let selected = [];

  for (let file of projectList) {
    let project = get('source/projects/' + file);
    project.slug = file.split('.')[0];

    // Cast string to bool.
    project.publish = (project.publish === 'true');

    // Projects with publish true get their own page.
    if (project.publish) {
      project.link = '/projects/' + project.slug;
      project.tag = 'a';
    } else {
      project.classList = 'inactive';
      project.tag = 'div';
    }

    projects.push(project);

    if (project.selected === 'true') {
      selected.push(project);
    }
  }

  function sortOperation(a, b) {
    const sA = Number(a.year) + Number(a.month ?? 13) / 12 + (a.publish ? 1000 : 0);
    const sB = Number(b.year) + Number(b.month ?? 13) / 12 + (b.publish ? 1000 : 0);
    return sB - sA;
  }

  // Sort the projects by year.
  projects.sort(sortOperation);
  selected.sort(sortOperation);
  return { projects, selected };
}


// –-- HOME ––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––
/**
 * Build the home page.
 */
function home() {
  write('www/index.html', page({
    header: header(),
    title: 'Seamus Edson',
    body: template('homepage')({
      content: get('source/home.txt').content,
    }),
  }));
}


// –-- PROJECTS ––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––
/**
 * Build the one off project pages
 */
function projectPage(project) {
  write('www/projects/' + project.slug + '/index.html', page({
    header: header({ nav: getNav('projects/' + project.slug) }),
    title: project.title,
    body: template('projectpage')(project)
  }));
}

/**
 * Build the project index.
 */
function projectIndex({ projects, selected }) {
  write('www/projects/index.html', page({
    header: header({ nav: getNav('projects') }),
    title: 'Seamus Edson',
    body: template('projects')({ selected, projects }),
  }));
}


// –-- ABOUT  ––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––----
/**
 * Build the abotu page.
 */
function about() {
  write(`www/about/index.html`, page({
    header: header({ nav: getNav('about') }),
    title: `Seamus Edson - About`,
    body: template('page')({
      content: get('source/about.txt').content,
    }),
  }));
}


// –-- COLOPHON  ––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––-
/**
 * Build the colophon page.
 */
function colophon() {
  let log = fs.readFileSync('log.txt', 'utf8');
  log = log.split('\n').slice(0, 3).join('\n');
  log = parseContent(log);
  log = flattenContent(log.content);

  write('www/colophon/index.html', page({
    header: header({ nav: getNav('colophon') }),
    title: 'Seamus Edson - Colophon',
    body: template('colophon')({
      content: get('source/colophon.txt').content,
      log
    })
  }));

}

// –-- SCRAPS  –––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––
/**
 * Build the scraps page.
 */
function scraps() {
  let postList = fs.readdirSync('source/scraps');
  let posts = [];
  let postsJson = {};

  for (let fileName of postList) {
    let post = get('source/scraps/' + fileName);
    if (post.publish === 'false') {
      continue;
    }
    post.date = getDateFormat(new Date(post.timestamp));
    postsJson[post.id] = post;
    posts.push(post);
  }

  posts.sort((a, b) => {
    return new Date(a.timestamp) > new Date(b.timestamp) ? -1 : 1;
  });

  write('www/scraps/posts.json', JSON.stringify(postsJson, null, 2));

  write('www/scraps/index.html', page({
    header: header({ nav: getNav('scraps') }),
    title: 'Seamus Edson - Scraps',
    body: template('scraps')({
      posts: posts.map(p => template('post')(p)).join('\n'),
      ...widgets
    }),
  }));
}

// –-- SKETCH  –––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––
/**
 * Build the sketchbook page.
 */
function sketchbook() {
  const dirs = fs.readdirSync('www/img/sketchbook')
    .filter(x => x[0] !== '.')
    .sort((a, b) => {
      return seasonYearToSortValue(b) - seasonYearToSortValue(a);
    });

  const groups = dirs.map(dir => {
    const files = fs.readdirSync(`www/img/sketchbook/${dir}`)
      .filter((x, i) => x[0] !== '.');


    const images = files.map(file => {
      return template('sketchbook-image')({ url: `/img/sketchbook/${dir}/${file}` });
    }).join('\n');

    const links = files.map((_, i) => `<li>${i}</li>`).join('\n');

    return template('sketchbook-collection')({
      images,
      count: files.length,
      links,
      folder: dir,
      img: `/img/sketchbook/${dir}/${files[0]}`,
      ...widgets,
    });
  });

  write('www/sketchbook/index.html', page({
    header: header({ nav: getNav('sketchbook') }),
    title: 'Seamus Edson - Sketchbook',
    body: template('sketchbook')({
      content: groups.join('\n'),
    }),
  }));
}


/**
 * Build the site.
 * @returns 
 */
function main() {
  console.time('main');

  home();
  about();
  colophon();
  scraps();
  sketchbook();

  const { projects, selected } = fetchProjects();

  projects.filter(p => p.publish).forEach(p => {
    projectPage(p);
  });

  projectIndex({
    projects: projects.map(p => template('projectrow')(p)).join('\n'),
    selected: selected.map((p, i) => template('projectcard')({ ...p, index: i + 1 })).join('\n'),
  });

  console.timeEnd('main');
}



main();