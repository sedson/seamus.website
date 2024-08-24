const tmpl = document.getElementById('post-full');
const blocker = document.querySelector('.fs-blocker');

blocker.addEventListener('click', () => {
  window.location.hash = '';
})

let post = null;
let data = {};

function hashChange() {
  const hash = window.location.hash.replace('#', '');

  if (!post) {
    post = tmpl.content.children[0];
    document.body.append(post);

  }

  if (!data[hash]) {
    post.style.display = 'none';
    blocker.style.display = 'none';
    return;
  }

  post.style.display = 'block';
  blocker.style.display = 'block';

  post.querySelector('#post-title').innerText = data[hash].title;
  post.querySelector('#post-id').innerText = data[hash].id;
  post.querySelector('#post-content').innerHTML = data[hash].content;
  post.querySelector('#post-date').innerText = data[hash].date;
}


function main() {
  window.addEventListener('hashchange', e => {
    e.preventDefault();
    hashChange();
  });
}

window.addEventListener('DOMContentLoaded', async () => {
  const res = await fetch('/scraps/posts.json');
  data = await res.json();
  main();
  hashChange();
});