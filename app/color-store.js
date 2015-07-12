import EventEmitter from './vendor/mini-flux/EventEmitter';

const CHANGE = 'CHANGE';

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
    this.emit(CHANGE);
  }

  /**
   * @private
   * @param {string} color - hex color code
   * @returns {void}
   */
  onEnterColor(color) {
    console.log(color);
    this.emit(CHANGE);
  }
}

export default ColorStore;
