function favicon() {
  const hexVals = Object.values(colors);
  const rcol = () => hexVals[Math.floor(Math.random() * hexVals.length)];
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext("2d");

  canvas.width = 20;
  canvas.height = 20;

  ctx.fillStyle = rcol();
  ctx.fillRect(5, 5, 5, 5);
  ctx.fillStyle = rcol();
  ctx.fillRect(10, 5, 5, 5);
  ctx.fillStyle = rcol();
  ctx.fillRect(10, 10, 5, 5);
  ctx.fillStyle = rcol();
  ctx.fillRect(5, 10, 5, 5);

  const dataURL = canvas.toDataURL('image/png');

  const favicon = document.createElement('link');
  favicon.type = 'image/x-icon';
  favicon.rel = 'shortcut icon';
  favicon.href = dataURL;

  const existingFavicon = document.querySelector('link[rel="shortcut icon"]');
  if (existingFavicon) {
    existingFavicon.parentNode.removeChild(existingFavicon);
  }
  document.head.appendChild(favicon);
}
favicon();