const frameContainer = document.querySelector('.iframe-container');
const links = document.querySelectorAll('.cal-link');
const posts = document.querySelectorAll('.gen-post');
const btns = document.querySelectorAll('.randomize');

const frame = document.createElement('iframe');

frameContainer.append(frame);


function loadPage(i) {
  frame.remove();
  frame.classList.add('hidden');

  // currently, iframe is served from cloudflare pages.
  frame.src = `https://genuary2024.pages.dev/pages/${i}.html?noinfo`;

  frameContainer.append(frame);
  document.querySelector('.sketch-number').innerText = `( ${i} )`;

  frame.onload = () => {
    frame.classList.remove('hidden');
    console.log(frame.contentWindow);
    frame.contentWindow.document.body.classList.add('in-iframe');

  }
}


function update() {
  let p = window.location.hash.replace('#', '');
  p = Number(p);

  if (Number.isNaN(p) || p < 1 || p > 31) {
    p = 1;
  }

  loadPage(p);

  for (let link of links) {
    link.classList.remove('active');
    if (link.hash.replace('#', '') == p) {
      link.classList.add('active')
    }
  }

  for (let post of posts) {
    post.style.display = 'none';
  }

  document.getElementById('day-' + p).style.display = 'block';
}

for (let btn of btns) {
  btn.onclick = () => update();
}

window.addEventListener('DOMContentLoaded', e => {
  update();
});

window.addEventListener('hashchange', e => {
  update();
});