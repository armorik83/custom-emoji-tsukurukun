import EventEmitter from './vendor/mini-flux/EventEmitter';

const CHANGE = 'CHANGE';

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
    console.log(args[0], args[1]);
    const xheight = ['a', 'c', 'e', 'm', 'n', 'o', 'r', 's', 'u', 'v', 'w', 'x', 'z'];
    const ascenders = ['b', 'd', 'f', 'h', 'i', 'k', 'l', 't'];
    const descenders = ['g','j','p','q', 'y'];

    this.position = {
      x: 64,
      y: 90
    };
    this.emit(CHANGE);
  }
}

export default Charactertore;
