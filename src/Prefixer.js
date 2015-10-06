import assign from 'object-assign'
import getBrowserInformation from './getBrowserInformation'
import caniuseData from './caniuseData'
import plugins from './Plugins'

const defaultUserAgent = typeof navigator !== 'undefined' ? navigator.userAgent : undefined

export default class Prefixer {
  /**
   * Instantiante a new prefixer.
   * @param {string} userAgent - userAgent to gather prefix information according to caniuse.com
   */
  constructor(userAgent = defaultUserAgent) {
    this._userAgent = userAgent
    this._browserInfo = getBrowserInformation(userAgent)

    this.cssPrefix = this._browserInfo.cssPrefix
    this.jsPrefix = this._browserInfo.jsPrefix

    let data = caniuseData[this._browserInfo.browser]
    if (data) {
      this._requiresPrefix = Object.keys(data)
        .filter(key => data[key] >= this._browserInfo.version)
        .reduce((result, name) => {
          result[name] = true
          return result
        }, {})
      this._hasPropsRequiringPrefix = Object.keys(this._requiresPrefix).length > 0
    } else {
      this._hasPropsRequiringPrefix = false

      // TODO warn only in dev mode
      console.warn('Your userAgent seems to be not supported by inline-style-prefixer. Feel free to open an issue.')
    }
  }

  /**
   * Returns a prefixed version of the style object
   * @param {Object} styles - Style object that gets prefixed properties added
   * @returns {Object} - Style object with prefixed properties and valeus
   */
  prefix(styles) {
    // only add prefixes if needed
    if (!this._hasPropsRequiringPrefix) {
      return styles
    }

    styles = assign({}, styles)

    Object.keys(styles).forEach(property => {
      let value = styles[property]
      if (value instanceof Object) {
        // recursively loop through nested style objects
        styles[property] = this.prefix(value)
      } else {
        // add prefixes if needed
        if (this._requiresPrefix[property]) {
          styles[this.jsPrefix + caplitalizeString(property)] = value
          delete styles[property]
        }

        // resolve plugins
        let args = assign(
          {property, value, styles},
          this._browserInfo
        )
        plugins.forEach(plugin => {
          assign(styles, plugin(args))
        })
      }
    })

    return styles
  }
}

/**
 * Capitalizes first letter of a string
 * @param {String} str - str to caplitalize
 */
const caplitalizeString = str => str.charAt(0).toUpperCase() + str.slice(1)
