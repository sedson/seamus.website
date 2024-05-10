function changeImage(group, forward = true) {
  const ndx = Number(group.dataset.index) - 1;
  const count = Number(group.dataset.count);
  const folder = group.dataset.folder;

  let next = ndx + (forward ? 1 : -1);
  next = ((next + count) % count) + 1;

  group.querySelector('.counter').innerText = next;
  group.dataset.index = next;
  group.querySelector('duotone-image').src = `/img/sketchbook/${folder}/${folder}_scan${next}.png`;
}


const images = document.querySelectorAll('duotone-image');
for (let image of images) {
  const parent = image.parentElement.parentElement;
  image.addEventListener('click', e => {
    const rect = image.getBoundingClientRect();
    const right = e.clientX >= rect.left + rect.width / 2;
    changeImage(parent, right);
  });
}

const lefts = document.querySelectorAll('.arrow-left');
for (let arrow of lefts) {
  const parent = arrow.parentElement;
  arrow.onclick = () => changeImage(parent, false);
}

const rights = document.querySelectorAll('.arrow-right');
for (let arrow of rights) {
  const parent = arrow.parentElement;
  arrow.onclick = () => changeImage(parent, true);
}