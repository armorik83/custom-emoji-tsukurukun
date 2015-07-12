import lodash from 'lodash';

// const UNICODE_HIRAGANA_FROM = 12352; // as a reference
const UNICODE_LETTERLIKE_SYMBOLS_FROM = 8448;

const xheight = [
  'a', 'c', 'e', 'm', 'n', 'o', 'r', 's', 'u', 'v', 'w', 'x', 'z',
  'æ', 'œ', 'ø'
];
const uppercase = [
  'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M',
  'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'
];
const signs = [
  '!', '?', '#', '$', '%', '&', '*', '`', '+', '=', '<', '>', '.',
  ':'
];
const ascenders = [
  'b', 'd', 'f', 'h', 'i', 'k', 'l', 't', 'ß'
];
const diacriticals = [
  'à', 'á', 'â', 'ä', 'ã', 'å', 'ā', 'è', 'é', 'ê', 'ë', 'ē', 'î',
  'ï', 'í', 'ī', 'ń', 'ñ', 'ô', 'ö', 'ò', 'ó', 'ō', 'õ', 'û', 'ü',
  'ù', 'ú'
];
const numbers = [
  '1', '2', '3', '4', '5', '6', '7', '8', '9', '0'
];
const descenders = [
  'g', 'p', 'q', 'y', 'ç', ';', ','
];

/**
 * @private
 * @returns {Array<string>}
 */
function lettersWithAscender() {
  return xheight.concat(ascenders, diacriticals, numbers, uppercase, signs);
}

/**
 * @private
 * @returns {Array<string>}
 */
function lettersWithDescenders() {
  return xheight.concat(descenders);
}

/**
 * @param {string} character
 * @returns {boolean}
 */
export function isOnlyXheight(character) {
  return !character.split('').some((c) => {
    return lodash.indexOf(xheight, c) < 0;
  });
}

/**
 * @param {string} character
 * @returns {boolean}
 */
export function includeAscenders(character) {
  return !character.split('').some((c) => {
    return lodash.indexOf(lettersWithAscender(), c) < 0;
  });
}

/**
 * @param {string} character
 * @returns {boolean}
 */
export function includeDescenders(character) {
  return !character.split('').some((c) => {
    return lodash.indexOf(lettersWithDescenders(), c) < 0;
  });
}

/**
 * @param {string} character
 * @returns {boolean}
 */
export function includeZenkaku(character) {
  return character.split('').some((c) => {
    return UNICODE_LETTERLIKE_SYMBOLS_FROM <= c.charCodeAt(0);
  });
}
