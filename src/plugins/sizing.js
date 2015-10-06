const properties = ['maxHeight', 'maxWidth', 'width', 'height', 'columnWidth', 'minWidth', 'minHeight']
const values = ['min-content', 'max-content', 'fill-available', 'fit-content', 'contain-floats']

export default ({
  cssPrefix,
  property,
  value 
}) => {
  /**
   * This actually is only available with prefixes
   * NOTE: This might change in the feature
   */
  if (properties.indexOf(property) > -1 && values.indexOf(value) > -1) {
    return {
      [property]: cssPrefix + value
    }
  }
}
