const frame = document.querySelector('iframe');
const links = document.querySelectorAll('.cal-link');
const posts = document.querySelectorAll('.gen-post');
const btns = document.querySelectorAll('.randomize');

function update() {
  let p = window.location.hash.replace('#', '');
  p = Number(p);
  if (Number.isNaN(p)) {
    return;
  }

  if (p < 1 || p > 31) {
    return;
  }

  frame.src = `https://files.seamus.website/genuary/pages/${p}.html`
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

window.addEventListener('hashchange', (e) => {
  update();
});


window.addEventListener('DOMContentLoaded', e => {
  e.preventDefault();
  if (!window.location.hash) {
    window.location.hash = '#1';
  }
  update();
  window.scrollTo(0, 0);
});

frame.onload = () => {
  let p = window.location.hash.replace('#', '');
  document.querySelector('.sketch-number').innerText = `( ${p} )`;
}