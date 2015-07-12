/**
 * @private
 * @param {Window} window
 * @param {string} svgId
 * @param {number} width
 * @param {number} height
 * @returns {void}
 */
function generateBase64(_window, svgId, width, height) {
  const svgNode = _window.document.getElementById(svgId);
  if (!svgNode) { return ''; }

  const cloneNode = svgNode.cloneNode(true);
  cloneNode.setAttribute('width', width);
  cloneNode.setAttribute('height', height);
  const svgText = cloneNode.outerHTML;
  const encoded = _window.encodeURIComponent(svgText).replace(/%([0-9A-F]{2})/g, (match, p1) => {
    return String.fromCharCode('0x' + p1);
  });
  const base64SvgText = _window.btoa(encoded);

  return base64SvgText;
}

/**
 * @private
 * @param {Window} window
 * @param {string} base64SvgText
 * @param {number} width
 * @param {number} height
 * @returns {void}
 */
function toCanvas(_window, base64SvgText, width, height) {
  const src = 'data:image/svg+xml;charset=utf-8;base64,' + base64SvgText;
  const canvas = _window.document.createElement('canvas');
  const context = canvas.getContext('2d');
  const image = new _window.Image();
  canvas.width = width;
  canvas.height = height;
  image.onload = () => {
    context.drawImage(image, 0, 0);
    _window.open(canvas.toDataURL('image/png'), '_blank');
  };
  image.src = src;
}

/**
 * @param {Window} window
 * @param {string} svgId
 * @param {number} width
 * @param {number} height
 * @returns {void}
 */
export default function download(_window, svgId, width, height) {
  const base64 = generateBase64(_window, svgId, width, height);
  toCanvas(_window, base64, width, height);
}
