import angular from 'angular';
import lodash from 'lodash';
import {appName, defaultSize, defaultColor, palette, websiteUrl} from '../constants';
import download from '../downloader';
import preset from '../preset';

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
const domLoadingWait = 60;

class CeAppController {
  constructor($timeout, $routeParams) {
    CeAppController.$inject = ['$timeout', '$routeParams'];
    this.$timeout = $timeout;
    this.$routeParams = $routeParams;

    characterStore.on('CHANGE', this.onCharacterStoreChange.bind(this));
    colorStore.on('CHANGE', this.onColorStoreChange.bind(this));

    this.magnification = 2;
    this.palette = palette;

    this.first = true;
    this.receiveRouteParams();

    this.$timeout(() => {
      window.document.getElementById('character').focus();
    }, 0);

    action.applicationReady();
  }

  /**
   * @private
   * @returns {void}
   */
  receiveRouteParams() {
    const paramsCharacter = this.$routeParams.character;
    if (paramsCharacter === void 0 || paramsCharacter === null || paramsCharacter === '') {
      return this.useRandomPreset();
    }

    this.$timeout(() => {
      this.onChangeCharacter(paramsCharacter);
      this.$routeParams.character = '';
    }, domLoadingWait);

    if (this.$routeParams.l || this.$routeParams.t || this.$routeParams.sp) {
      this.$timeout(() => {
        this.manual.left = this.$routeParams.l;
        this.manual.top = this.$routeParams.t;
        this.manual.spacing = this.$routeParams.sp;
        this.onChangeManualPosition();
      }, domLoadingWait);
    }

    if (this.$routeParams.c) {
      this.$timeout(() => {
        this.onChangeColor(this.$routeParams.c);
      }, domLoadingWait);
    }
  }

  /**
   * @private
   * @returns {void}
   */
  useRandomPreset() {
    const pick = preset[lodash.random(0, preset.length - 1)];
    this.$timeout(() => { this.onChangeCharacter(pick.ch); }, domLoadingWait);
    this.$timeout(() => { this.onChangeColor(pick.color); }, domLoadingWait);
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
    this.color = this.color || '';

    if (this.first && this.color.length === 0) {
      this.first = false;
      this.color = colorStore.colorSet.input;
    }

    if (this.color.length === 0) {
      this.$timeout(() => {
        if (this.color.length === 0) {
          // replace if it remains length === 0.
          this.color = colorStore.colorSet.input;
        }
      }, 2000);
    }

    if (colorStore.colorSet.valid && this.color.length === 6) {
      this.color = colorStore.colorSet.input;
    }
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
    if (6 < v.length) {
      this.color = v.slice(0, 6);
    }
    action.enterColor(v.slice(0, 6));
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
      /* eslint-enable no-multi-spaces */

      const _color = ((c) => {
        if (!c || c === '' || c === defaultColor) { return ''; }
        return `c=${c}`;
      })(color);

      const _version = 'v=01'; // reserved

      const values = lodash.filter([_left, _top, _spacing, _color, _version]);
      if (values.length === 0) { return ''; }

      return '?' + values.join('&');
    })(this.manual, this.colorSet.input);

    const character = ((ch, p) => {
      if (ch === void 0 || ch === null) { return ''; }
      return `${ch}${p}`;
    })(this.character, params);

    return `${websiteUrl}${character}`;
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
