const ts = document.getElementById('timestamp');
if (ts) {
  ts.innerText = (new Date).toLocaleDateString(undefined, { year: 'numeric', month: 'numeric', day: 'numeric' });
}