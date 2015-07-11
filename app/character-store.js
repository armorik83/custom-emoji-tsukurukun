import EventEmitter from './vendor/mini-flux/EventEmitter';
import lodash from 'lodash';

const CHANGE = 'CHANGE';
const UNICODE_HIRAGANA_FROM = 12352;

class Charactertore extends EventEmitter {
  constructor(dispatcher) {
    super();

    /* eslint-disable no-multi-spaces */
    dispatcher.on('applicationReady', this.onApplicationReady.bind(this));
    dispatcher.on('enterCharacter',   this.onEnterCharacter.bind(this));
    dispatcher.on('computePosition',  this.onComputePosition.bind(this));
    /* eslint-enable no-multi-spaces */
  }

  /**
   * @private
   * @returns {void}
   */
  onApplicationReady() {
    // noop
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

    const xheight = ['a', 'c', 'e', 'm', 'n', 'o', 'r', 's', 'u', 'v', 'w', 'x', 'z', 'æ', 'œ', 'ø'];
    const ascenders = ['b', 'd', 'f', 'h', 'i', 'k', 'l', 't', 'ß'];
    const diacriticals = [
      'à', 'á', 'â', 'ä', 'ã', 'å', 'ā', 'è', 'é', 'ê',
      'ë', 'ē', 'î', 'ï', 'í', 'ī', 'ń', 'ñ', 'ô', 'ö',
      'ò', 'ó', 'ō', 'õ', 'û', 'ü', 'ù', 'ú'
    ];
    const numbers = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];
    const descenders = ['g', 'p', 'q', 'y', 'ç'];

    const isOnlyXheight = !character.split('').some((c) => {
      return lodash.indexOf(xheight, c) < 0;
    });

    const includeAscenders = !character.split('').some((c) => {
      return lodash.indexOf(xheight.concat(ascenders).concat(diacriticals).concat(numbers), c) < 0;
    });

    const includeDescenders = !character.split('').some((c) => {
      return lodash.indexOf(xheight.concat(descenders), c) < 0;
    });

    const includeZenkaku = character.split('').some((c) => {
      return UNICODE_HIRAGANA_FROM <= c.charCodeAt(0);
    });

    const defaultFontSize = 86;
    const fontSize = (() => {
      if (100 < bBox.width) {
        const reductionRatio = 100 / bBox.width;
        return defaultFontSize * reductionRatio;
      }
      return defaultFontSize;
    })();

    const y = (() => {
      const d = defaultFontSize;
      const diff = (defaultFontSize - fontSize) * 0.25;
      if (includeZenkaku) { return (d - diff) * 1.1272; }
      if (isOnlyXheight) { return (d - diff) * 1.0349; }
      if (includeAscenders) { return (d - diff) * 1.1395; }
      if (includeDescenders) { return (d - diff) * 0.9651; }
      return (d - diff) * 1.0581;
    })();

    this.position = {
      x:        64,
      y:        y,
      fontSize: fontSize
    };

    this.emit(CHANGE);
  }
}

export default Charactertore;
