import angular from 'angular';
import {appName} from '../constants';

const directiveName = 'ceEmoji';

class CeEmojiController {
  constructor() {
    //
  }
}

function ddo() {
  return {
    restrict:     'E',
    scope:        {},
    templateUrl:  './app/directives/ce-emoji.html',
    controller:   CeEmojiController,
    controllerAs: directiveName
  };
}

angular.module(appName).directive(directiveName, ddo);
