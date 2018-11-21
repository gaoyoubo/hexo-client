const hexoUtil = require('hexo-util')

class Utils {
  getPostSummary (content) {
    let textContent = hexoUtil.stripHTML(content).trim()
      .replace(/\n/g, ' ').replace(/\s+/g, ' ')
    if (textContent.length > 100) {
      return textContent.substring(0, 100) + '...'
    } else {
      return textContent
    }
  }

  hasClass (element, cls) {
    return (' ' + element.className + ' ').indexOf(' ' + cls + ' ') > -1
  }
}

export default new Utils()
