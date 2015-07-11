import angular from 'angular';
import {appName} from '../constants';

// Flux
import EventEmitter from '../vendor/mini-flux/EventEmitter';
import AppAction from '../app-action';
import Charactertore from '../character-store';
const dispatcher = new EventEmitter();
export const action = new AppAction(dispatcher);
const store = new Charactertore(dispatcher);

// Constants
const directiveName = 'ceApp';

class CeAppController {
  constructor() {
    store.on('CHANGE', this.onStoreChange.bind(this));
    action.applicationReady();
  }

  /**
   * @private
   * @returns {void}
   */
  onStoreChange() {
    this.character = store.character;
    this.position = store.position;
    this.position.fontSize = this.position.fontSize || 86;
  }

  /**
   * @param {string} v
   * @returns {void}
   */
  onChangeCharacter(v) {
    action.enterCharacter(v);
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
