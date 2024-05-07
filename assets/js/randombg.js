const container = document.querySelector('.shapes');


console.log(container);
const cols = ['mint', 'orange', 'sand', 'gray', 'ginger', 'vert', 'melon', 'red',
  'lime', 'turquoise', 'blue', 'burgundy', 'lilac', 'forest', 'rose', 'mango',
  'chocolate', 'raspberry', 'sky', 'black', 'white'
];
const spots = ['col-1', 'col-2', 'col-3', 'col-4', 'col-2', 'col-3']

for (let i = 0; i < 40; i++) {
  const circle = document.createElement('div');
  circle.classList.add('circle');
  circle.classList.add(spots[(Math.floor(Math.random() * spots.length))])
  Object.assign(circle.style, {
    // left: Math.floor(Math.random() * 20) / 20 * 100 + '%',
    top: Math.floor(Math.random() * 20) * 5 + 'rem',
    position: 'fixed',
    backgroundColor: `var(--${cols[(Math.floor(Math.random() * cols.length))]})`,
  });
  container.append(circle);
}