import tinycolor from 'tinycolor2';
import EventEmitter from './vendor/mini-flux/EventEmitter';

const CHANGE = 'CHANGE';

const defaultColor = '829cb4';

function hueArea(h) {
  const d = 60;
  if (h < d * 1 - d * 0.5) { return 0; }
  if (h < d * 2 - d * 0.5) { return 1; }
  if (h < d * 3 - d * 0.5) { return 2; }
  if (h < d * 4 - d * 0.5) { return 3; }
  if (h < d * 5 - d * 0.5) { return 4; }
  if (h < d * 6 - d * 0.5) { return 5; }
  return 0;
}

function generateColorSet(color) {
  if (!tinycolor(color).isValid()) { return void 0; }

  const hue = tinycolor(color).toHsv().h;
  const area = hueArea(hue);

  const reflected = (() => {
    const hsv = tinycolor(color).toHsv();
    hsv.s *= 0.2;
    hsv.v = 0.98;
    return tinycolor(hsv).toHexString();
  })();

  /* eslint-disable key-spacing, no-multi-spaces */
  const darkenFine = ((a) => {
    if (a === 1/* orange */) { return -3; }
    if (a === 2/* green */)  { return -7; }
    return 0;
  })(area);

  return {
    input:      tinycolor(color).toString(),
    highlight:  tinycolor(reflected).lighten(2).toString(),
    reflected:  reflected,
    textShadow: tinycolor(color).darken(25).toString(),
    body: {
      top:      tinycolor(color).darken(0.5).toString(),
      bottom:   tinycolor(color).darken(10.6).toString()
    },
    surface: {
      top:      tinycolor(color).darken(11.5 + darkenFine).toString(),
      bottom:   tinycolor(color).darken(19 + darkenFine).toString()
    },
    border: {
      top:      tinycolor(color).darken(17.5 + darkenFine).toString(),
      bottom:   tinycolor(color).darken(29 + darkenFine).desaturate(2).toString()
    }
  };
  /* eslint-enable key-spacing, no-multi-spaces */
}

class ColorStore extends EventEmitter {
  constructor(dispatcher) {
    super();

    /* eslint-disable no-multi-spaces */
    dispatcher.on('applicationReady', this.onApplicationReady.bind(this));
    dispatcher.on('enterColor',       this.onEnterColor.bind(this));
    /* eslint-enable no-multi-spaces */
  }

  /**
   * @private
   * @returns {void}
   */
  onApplicationReady() {
    this.colorSet = generateColorSet(defaultColor);

    this.emit(CHANGE);
  }

  /**
   * @private
   * @param {string} color - hex color code
   * @returns {void}
   */
  onEnterColor(color) {
    const colorSet = ((c) => {
      if (c === void 0 || c === null || c === '') {
        return generateColorSet(defaultColor);
      }
      return generateColorSet(c);
    })(color);

    if (colorSet) {
      this.colorSet = colorSet;
    }

    this.emit(CHANGE);
  }
}

export default ColorStore;
