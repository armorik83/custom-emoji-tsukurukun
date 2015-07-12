import angular from 'angular';
import {appName} from '../constants';

// Flux
import EventEmitter from '../vendor/mini-flux/EventEmitter';
import AppAction from '../app-action';
import CharacterStore from '../character-store';
import ColorStore from '../color-store';
const dispatcher = new EventEmitter();
export const action = new AppAction(dispatcher);
const characterStore = new CharacterStore(dispatcher);
const colorStore = new ColorStore(dispatcher);

// Constants
const directiveName = 'ceApp';

class CeAppController {
  constructor() {
    characterStore.on('CHANGE', this.onCharacterStoreChange.bind(this));
    colorStore.on('CHANGE', this.onColorStoreChange.bind(this));
    action.applicationReady();
  }

  /**
   * @private
   * @returns {void}
   */
  onCharacterStoreChange() {
    this.character = characterStore.character;
    this.position = characterStore.position;
    this.manual = JSON.parse(JSON.stringify(characterStore.manual));
  }

  /**
   * @private
   * @returns {void}
   */
  onColorStoreChange() {
    //
  }

  /**
   * @param {string} v
   * @returns {void}
   */
  onChangeCharacter(v) {
    action.enterCharacter(v);
  }

  /**
   * @returns {void}
   */
  onChangeManualPosition() {
    action.changeManualPosition(this.manual);
  }

  /**
   * @param {string} v
   * @returns {void}
   */
  onChangeColor(v) {
    action.enterColor(v);
  }
}

function ddo() {
  return {
    restrict:     'E',
    scope:        {},
    templateUrl:  './app/directives/ce-app.html',
    controller:   CeAppController,
    controllerAs: directiveName
  };
}

angular.module(appName).directive(directiveName, ddo);
