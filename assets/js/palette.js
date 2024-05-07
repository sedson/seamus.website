const colors = {
  mint: '#b2e1d2',
  orange: '#ff8c00',
  sand: '#e8e1d6',
  gray: '#b8bbb5',
  ginger: '#cd9a62',
  vert: '#006922',
  melon: '#f3c1aa',
  red: '#e54127',
  lime: '#d8eb27',
  turquoise: '#007b82',
  blue: '#2311e4',
  burgundy: '#5e183b',
  lilac: '#bdbdf7',
  forest: '#003c38',
  rose: '#f892c5',
  mango: '#ffc20e',
  chocolate: '#945526',
  raspberry: '#b7274d',
  sky: '#78c5f8',
  black: '#111111',
  white: '#f6f2eA',
};


const combinations = [
  ['white', 'blue', 'rose'],
  ['white', 'red', 'chocolate'],
  ['white', 'vert', 'rose'],

  ['lilac', 'black', 'ginger'],
  ['mango', 'black', 'red'],
  ['lime', 'black', 'gray'],

  ['vert', 'rose', 'white'],
  ['sky', 'burgundy', 'vert'],
  ['melon', 'chocolate', 'mint'],
  // ['raspberry', 'rose'],
  // ['chocolate', 'rose'],
  // ['sky', 'vert'],
  // ['sky', 'chocolate'],
];

/**
 * Store the user pallette. 
 */
function storeColors(text, page, accent) {
  console.log
  try {
    localStorage.setItem('user-colors', JSON.stringify({ text, page, accent }));
  } catch (e) {
    console.warn(e);
  }
}


function loadColors() {
  try {
    const cols = JSON.parse(localStorage.getItem('user-colors'));
    const root = document.querySelector(':root');
    root.style.setProperty('--text-color', cols.text);
    root.style.setProperty('--page-color', cols.page);
    root.style.setProperty('--accent-color', cols.accent);

  } catch (e) {
    console.warn(e);
  }
}


function swapColors() {
  const root = document.querySelector(':root');
  const text = getComputedStyle(root).getPropertyValue('--text-color');
  const page = getComputedStyle(root).getPropertyValue('--page-color');
  root.style.setProperty('--text-color', page);
  root.style.setProperty('--page-color', text);
  storeColors(page, text);
  document.dispatchEvent(new Event('palette-change'));
}

function randomColors() {
  const root = document.querySelector(':root');
  const combination = combinations[Math.floor(Math.random() * combinations.length)];
  const page = colors[combination[0]];
  const text = colors[combination[1]];
  const accent = colors[combination[2]];

  root.style.setProperty('--text-color', text);
  root.style.setProperty('--page-color', page);
  root.style.setProperty('--accent-color', accent);
  storeColors(text, page, accent);
  document.dispatchEvent(new Event('palette-change'));
}

function resetColors() {
  const root = document.querySelector(':root');
  const defaultText = getComputedStyle(root).getPropertyValue('--default-text-color');
  const defaultPage = getComputedStyle(root).getPropertyValue('--default-page-color');
  root.style.setProperty('--text-color', defaultText);
  root.style.setProperty('--page-color', defaultPage);
  storeColors(defaultText, defaultPage);
  document.dispatchEvent(new Event('palette-change'));
}

window.addEventListener('DOMContentLoaded', () => {
  document.getElementById('swap-colors').onclick = swapColors;
  document.getElementById('random-colors').onclick = randomColors;
  document.getElementById('reset-colors').onclick = resetColors;
});

loadColors();