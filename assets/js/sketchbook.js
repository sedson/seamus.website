const cursor = document.getElementById('sketchbook-cursor');

const images = document.querySelectorAll('duotone-image');

function positionCursor(x, y, left) {
  cursor.style.left = x + 'px';
  cursor.style.top = y + 'px';
  if (left) {
    cursor.style.transform = 'translate(-50%, -50%) rotate(180deg)';
  } else {
    cursor.style.transform = 'translate(-50%, -50%)';
  }
}

for (let image of images) {

  const parent = image.parentElement.parentElement;
  const counter = parent.querySelector('.counter');


  image.addEventListener('click', e => {
    const rect = image.getBoundingClientRect();
    const left = e.clientX < rect.left + rect.width / 2;

    const ndx = Number(image.dataset.index) - 1;
    const count = Number(image.dataset.count);
    const folder = image.dataset.folder;

    let next = ndx + (left ? -1 : 1);
    next = ((next + count) % count) + 1;

    counter.innerText = next;
    image.dataset.index = next;
    image.src = `/img/sketchbook/${folder}/${folder}_scan${next}.png`;
  });

  image.addEventListener('mousemove', e => {
    const rect = image.getBoundingClientRect();
    const left = e.clientX < rect.left + rect.width / 2;
    positionCursor(e.clientX, e.clientY, left);

  });

  image.addEventListener('mouseout', e => {
    cursor.style.visibility = 'hidden';
  });

  image.addEventListener('mouseover', e => {
    cursor.style.visibility = 'visible';
    const rect = image.getBoundingClientRect();
    const left = e.clientX < rect.left + rect.width / 2;
    positionCursor(e.clientX, e.clientY, left);
  });
}