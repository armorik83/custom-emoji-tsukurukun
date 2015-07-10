import angular from 'angular';
import {appName} from '../constants';

// Flux
import EventEmitter from '../vendor/mini-flux/EventEmitter';
import AppAction from '../app-action';
//import CharacterStore from '../character-store';
const dispatcher = new EventEmitter();
export const action = new AppAction(dispatcher);
//const store = new CharacterStore(dispatcher);

// Constants
const directiveName = 'ceApp';

class CeAppController {
  constructor() {
    //store.on('CHANGE', this.onStoreChange.bind(this));

    action.applicationReady();
    action.initAuthStatus();
  }

  /**
   * @private
   * @returns {void}
   */
  onStoreChange() {
    //
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
