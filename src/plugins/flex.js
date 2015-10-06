const values = ['flex', 'inline-flex']

export default ({
  browser,
  cssPrefix,
  property,
  value,
  version
}) => {
  if (property === 'display' && values.indexOf(value) > -1 && browser === 'chrome' && (version < 29 || version > 20) || (browser === 'safari' || browser === 'ios_saf') && (version < 9 || version > 6) || browser === 'opera' && (version == 15 || version == 16)) {
    return {
      [property]: cssPrefix + value
    }
  }
}
