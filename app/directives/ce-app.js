import angular from 'angular';
import lodash from 'lodash';
import {appName, defaultSize, palette, websiteUrl} from '../constants';
import download from '../downloader';

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
  constructor($timeout, $routeParams) {
    CeAppController.$inject = ['$timeout', '$routeParams'];
    this.$timeout = $timeout;
    this.$routeParams = $routeParams;

    characterStore.on('CHANGE', this.onCharacterStoreChange.bind(this));
    colorStore.on('CHANGE', this.onColorStoreChange.bind(this));

    this.magnification = 2;
    this.palette = palette;

    this.receiveRouteParams();

    action.applicationReady();
  }

  /**
   * @private
   * @returns {void}
   */
  receiveRouteParams() {
    if (this.$routeParams.character) {
      this.$timeout(() => {
        this.onChangeCharacter(this.$routeParams.character);
        this.$routeParams.character = '';
      }, 0);
    }

    if (this.$routeParams.l || this.$routeParams.t || this.$routeParams.sp) {
      this.$timeout(() => {
        this.manual.left = this.$routeParams.l;
        this.manual.top = this.$routeParams.t;
        this.manual.spacing = this.$routeParams.sp;
        this.onChangeManualPosition();
      }, 1);
    }
  }

  /**
   * @private
   * @returns {void}
   */
  onCharacterStoreChange() {
    this.character = characterStore.character;
    this.position = characterStore.position;
    if (characterStore.manual) {
      this.manual = JSON.parse(JSON.stringify(characterStore.manual));
    }
  }

  /**
   * @private
   * @returns {void}
   */
  onColorStoreChange() {
    this.color = colorStore.colorSet.input;
    this.colorSet = colorStore.colorSet;
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

  /**
   * @returns {void}
   */
  saveAsPng() {
    download(window, 'emoji', defaultSize.width, defaultSize.height);
  }

  /**
   * @returns {string}
   */
  generatePermanent() {
    const params = ((manual, color) => {
      if (!manual.left && !manual.top && !manual.spacing && !color) {
        return '';
      }
      /* eslint-disable no-multi-spaces */
      const _left =    manual.left    ? `l=${manual.left}`     : '';
      const _top =     manual.top     ? `t=${manual.top}`      : '';
      const _spacing = manual.spacing ? `sp=${manual.spacing}` : '';
      const _color =   color          ? `c=${color}`           : '';
      /* eslint-enable no-multi-spaces */

      const values = lodash.filter([_left, _top, _spacing, _color]);

      return '?' + values.join('&');
    })(this.manual, this.colorSet.input);

    return `${websiteUrl}${this.character}${params}`;
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
