/**
 * @param {string} code
 * @todo use svgo
 */
function optimizeSvg(code) {
  return (
    code
      .trim()
      // We don't use g flag here, because we only want to change the first attribute of each
      .replace(/\b(height)=('|")\d+\2/, '$1="100%"')
      .replace(/\b(width)=('|")\d+\2/, '$1="100%"')
  );
}

module.exports = {
  optimizeSvg,
};
