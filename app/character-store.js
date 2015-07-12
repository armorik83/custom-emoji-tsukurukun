import EventEmitter from './vendor/mini-flux/EventEmitter';
import {defaultFontSize} from './constants';
import {
  isOnlyXheight,
  includeAscenders,
  includeDescenders,
  includeZenkaku
} from './letter-matchers';

const CHANGE = 'CHANGE';

/**
 * @param {number} defFontSize - defaultFontSize
 * @param {number} bBox
 * @return {number}
 */
function computeFontSize(defFontSize, width) {
  const threshold = 100;
  if (width <= threshold) { return defFontSize; }
  const reductionRatio = 100 / width;
  return defFontSize * reductionRatio;
}

/**
 * @param {string} ch - character
 * @param {number} fontSize
 * @return {number}
 */
function computeBasicY(ch, fontSize) {
  const diff = (defaultFontSize - fontSize) * 0.25;
  const base =  defaultFontSize - diff;
  /* eslint-disable no-multi-spaces */
  if (includeZenkaku(ch))    { return base * 1.13; }
  if (isOnlyXheight(ch))     { return base * 1.07; }
  if (includeAscenders(ch))  { return base * 1.12; }
  if (includeDescenders(ch)) { return base * 0.97; }
  /* eslint-enable no-multi-spaces */
  return base * 1.06;
}

/**
 * @param {number} y - basic y
 * @param {number} length - character length
 * @param {number} width
 * @return {number}
 */
function computeCorrectedY(y, length, width) {
  const threshold = 135; // width of "xxx" is 135.7
  if (width <= threshold) { return y; }
  const correctionValue = -1 * (2 + length * 0.18);
  return y + correctionValue;
}

class Charactertore extends EventEmitter {
  constructor(dispatcher) {
    super();

    /* eslint-disable no-multi-spaces */
    dispatcher.on('applicationReady',     this.onApplicationReady.bind(this));
    dispatcher.on('enterCharacter',       this.onEnterCharacter.bind(this));
    dispatcher.on('computePosition',      this.onComputePosition.bind(this));
    dispatcher.on('changeManualPosition', this.onChangeManualPosition.bind(this));
    /* eslint-enable no-multi-spaces */
  }

  /**
   * @private
   * @returns {void}
   */
  onApplicationReady() {
    this.position = {
      x:        64, // center
      y:        defaultFontSize,
      fontSize: defaultFontSize,
      spacing:  0
    };

    this.manual = {
      left:    0,
      top:     0,
      spacing: 0
    };

    this.emit(CHANGE);
  }

  /**
   * @private
   * @param {string} character
   * @returns {void}
   */
  onEnterCharacter(character) {
    this.character = character;
    this.emit(CHANGE);
  }

  /**
   * @param {[string, BBox]} args
   * @returns {void}
   */
  onComputePosition(args) {
    const character = args[0] || '';
    const bBox = args[1];
    bBox.width = bBox.width || 0;

    const fontSize =   computeFontSize(defaultFontSize, bBox.width);
    const basicY =     computeBasicY(character, fontSize);
    const correctedY = computeCorrectedY(basicY, character.length, bBox.width);

    this.position = this.position || {};
    this.position.y = correctedY;
    this.position.fontSize = fontSize;
    this.position.y = correctedY;

    this.emit(CHANGE);
  }

  onChangeManualPosition(manual) {
    /* eslint-disable no-multi-spaces */
    manual.left    = parseFloat(manual.left) || 0;
    manual.top     = parseFloat(manual.top)  || 0;
    manual.spacing = ((s) => {
      if (s === void 0 || s === null) { return 1; }
      return parseFloat(s);
    })(manual.spacing);

    const diff = {
      left:    this.manual.left    - manual.left,
      top:     this.manual.top     - manual.top,
      spacing: this.manual.spacing - manual.spacing
    };

    const ratio = 0.3;
    const invert = -1;
    this.position.x       += diff.left    * ratio * invert;
    this.position.y       += diff.top     * ratio * invert;
    this.position.spacing += diff.spacing * ratio * invert;

    this.manual = manual;

    /* eslint-enable no-multi-spaces */

    this.emit(CHANGE);
  }
}

export default Charactertore;
