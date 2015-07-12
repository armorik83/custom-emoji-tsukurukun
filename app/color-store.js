import tinycolor from 'tinycolor2';
import EventEmitter from './vendor/mini-flux/EventEmitter';

const CHANGE = 'CHANGE';

const defaultColor = '829cb4';

function generateColorSet(color) {
  if (!tinycolor(color).isValid()) { return void 0; }

  const reflected = (() => {
    const hsv = tinycolor(color).toHsv();
    hsv.s *= 0.2;
    hsv.v = 0.98;
    return tinycolor(hsv).toHexString();
  })();

  /* eslint-disable key-spacing */
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
      top:      tinycolor(color).darken(11.5).toString(),
      bottom:   tinycolor(color).darken(19).toString()
    },
    border: {
      top:      tinycolor(color).darken(17.5).toString(),
      bottom:   tinycolor(color).darken(29).desaturate(2).toString()
    }
  };
  /* eslint-enable key-spacing */
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
