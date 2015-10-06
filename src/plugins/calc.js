export default ({
  browser,
  cssPrefix,
  property,
  value,
  version
}) => {
  if (value.indexOf('calc(') > -1 && browser === 'firefox' && version < 15 || browser === 'chrome' && version < 25 || browser === 'safari' && version < 6.1 || browser === 'ios_saf' && version < 7) {
    return {
      [property]: value.replace(/calc\(/g, cssPrefix + 'calc(')
    }
  }
}
