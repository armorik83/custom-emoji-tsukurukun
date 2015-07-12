export default class AppAction {
  constructor(dispatcher) {
    this.dispatcher = dispatcher;
  }

  /**
   * @returns {void}
   */
  applicationReady() { this.dispatcher.emit('applicationReady'); }

  /**
   * @param {string} character
   * @returns {void}
   */
  enterCharacter(character) { this.dispatcher.emit('enterCharacter', character); }

  /**
   * @param {string} character
   * @param {BBox} bBox
   * @returns {void}
   */
  computePosition(...args) { this.dispatcher.emit('computePosition', args); }

  /**
   * @param {{left: number, top: number, spacing: number}} manual
   * @returns {void}
   */
  changeManualPosition(manual) { this.dispatcher.emit('changeManualPosition', manual); }
}
