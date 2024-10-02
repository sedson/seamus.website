class DuotoneImage extends HTMLElement {
  constructor() {
    super();
    const shadowRoot = this.attachShadow({ mode: 'open' });
    this.canvas = document.createElement('canvas');
    Object.assign(this.canvas.style, {
      width: '100%',
      height: 'auto',
      transition: 'opacity 0.1s'
    });
    this.ctx = this.canvas.getContext('2d');
    this.canvas.width = 500;
    this.canvas.height = 400;
    this.img = document.createElement('img');
    shadowRoot.append(this.canvas);
  }

  static get observedAttributes() {
    return ['src', 'maintain-brightness', 'use-accent'];
  }

  parseRgb255(str) {
    const s = str.replace(/[rgba() ]/g, '');
    return s.split(',').map(x => Number(x));
  }

  parseHex(str) {
    const s = str.replace(/[# ]/g, '');
    return [
      parseInt(s.substring(0, 2), 16),
      parseInt(s.substring(2, 4), 16),
      parseInt(s.substring(4, 6), 16),
    ];
  }

  brightness(rgb) {
    return (0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2]);
  }

  /** Lerp and floor. */
  lerp255(a, b, t) {
    return Math.floor(a + t * (b - a));
  }


  get src() {
    return this.getAttribute('src');
  }

  set src(val) {
    this.setAttribute('src', val);
    this.fetchSrc();
  }

  get maintainBrightness() {
    return this.getAttribute('maintain-brightness');
  }

  get useAccent() {
    return this.getAttribute('use-accent');
  }

  connectedCallback() {
    this.fetchSrc();
    document.addEventListener('palette-change', () => this.render());
  }

  attributeChangeCallback() {
    this.fetchSrc();
  }

  fetchSrc() {
    if (!this.src) return;
    this.img.src = this.src;
    this.canvas.style.opacity = 0;
    this.img.onload = () => {
      this.canvas.width = this.img.width;
      this.canvas.height = this.img.height;
      this.render();
    }
    this.img.onerror = (e) => {
      console.error(e);
    }
  }

  async render() {
    this.ctx.drawImage(this.img, 0, 0);
    let fg = this.parseRgb255(getComputedStyle(document.body).getPropertyValue('color'));
    let bg = this.parseRgb255(getComputedStyle(document.body).getPropertyValue('background-color'));

    if (this.maintainBrightness) {
      if (this.brightness(fg) > this.brightness(bg)) {
        let swap = fg;
        fg = bg;
        bg = swap;
      };
    }

    if (this.useAccent) {
      fg = this.parseHex(getComputedStyle(document.body).getPropertyValue('--accent-color'));
    }

    const data = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
    for (let y = 0; y < data.height; y++) {
      for (let x = 0; x < data.width; x++) {
        const ndx = 4 * (y * data.width + x);
        let fac = data.data[ndx] / 255;
        fac = Math.min(Math.floor((fac + 0.0) * 20) / 20, 1);
        const r = this.lerp255(fg[0], bg[0], fac);
        const g = this.lerp255(fg[1], bg[1], fac);
        const b = this.lerp255(fg[2], bg[2], fac);
        data.data[ndx + 0] = r;
        data.data[ndx + 1] = g;
        data.data[ndx + 2] = b;
      }
    }
    this.ctx.putImageData(data, 0, 0);
    this.canvas.style.opacity = 1;
  }
}

customElements.define('duotone-image', DuotoneImage);