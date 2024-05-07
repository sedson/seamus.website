/**
 * Store the user pallette. 
 */
function storeGrid(grid) {
  try {
    localStorage.setItem('user-grid', grid);
  } catch (e) {
    console.warn(e);
  }
}

let useGrid = loadGrid();
let grid = null;

function loadGrid() {
  try {
    return localStorage.getItem('user-grid') === 'true';
  } catch (e) {
    return true;
  }
}


function makeGrid() {
  grid = document.querySelector('.grid');
  if (!grid) return;
  if (!useGrid) {
    grid.style.opacity = 0;
  }

  const hline = (top, bottom) => {
    const l = document.createElement('div');
    l.classList.add('grid-hline');
    if (top) l.style.top = top;
    if (bottom) l.style.bottom = bottom;
    grid.append(l)
  }

  const vline = (left, right) => {
    const l = document.createElement('div');
    l.classList.add('grid-vline');
    if (left) l.style.left = left;
    if (right) l.style.right = right;
    grid.append(l)
  }

  hline('var(--body-pad)', null);
  hline('calc(var(--body-pad) + 1rem)', null);
  hline('calc(var(--body-pad) + 3rem)', null);
  hline(null, 'var(--body-pad)');

  vline('var(--body-pad)', null);
  vline(null, 'var(--body-pad)');
  vline('calc(1 / 6 * (100% - 2 * (var(--body-pad))) + var(--body-pad))', null);
  vline('calc(2 / 6 * (100% - 2 * (var(--body-pad))) + var(--body-pad))', null);
  vline('calc(3 / 6 * (100% - 2 * (var(--body-pad))) + var(--body-pad))', null);
  vline('calc(4 / 6 * (100% - 2 * (var(--body-pad))) + var(--body-pad))', null);
  vline('calc(5 / 6 * (100% - 2 * (var(--body-pad))) + var(--body-pad))', null);
}

window.addEventListener('DOMContentLoaded', () => {
  makeGrid();
  document.getElementById('toggle-grid').onclick = () => {
    useGrid = !useGrid;
    grid.style.opacity = useGrid ? 0.1 : 0;
    storeGrid(useGrid);
  }
});