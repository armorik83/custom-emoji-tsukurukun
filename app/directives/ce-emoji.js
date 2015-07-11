import angular from 'angular';
import {appName} from '../constants';

import {action} from './ce-app';

const directiveName = 'ceEmoji';

/**
 * @typedef {{x: number, y: number, width: number, height: number}} BBox
 */

/**
 * @param {Window} window
 * @param {string} character
 * @returns {BBox}
 */
function getBBox(window, character) {
  if (!character) { return {}; }
  if (character.length < 1) { return {}; }
  return window.document.getElementById('character-hidden-criteria').getBBox();
}

class CeEmojiController {
  constructor($rootScope) {
    CeEmojiController.$inject = ['$rootScope'];
    this.$rootScope = $rootScope;

    this.mag = 2; // magnification
    this.svg = {
      width:  128,
      height: 128
    };

    this.addWatchListener();
  }

  addWatchListener() {
    this.$rootScope.$watch(() => this.character, this.onChangeCharacter.bind(this));
  }

  onChangeCharacter(character) {
    const bBox = getBBox(window, character);
    action.computePosition(character, bBox);
  }
}

function ddo() {
  return {
    restrict:         'E',
    templateUrl:      './app/directives/ce-emoji.html',
    controller:       CeEmojiController,
    controllerAs:     directiveName,
    scope:            {},
    bindToController: {
      character: '=ceCharacter',
      pos:       '=cePosition'
    }
  };
}

angular.module(appName).directive(directiveName, ddo);
