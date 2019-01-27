// thanks for https://github.com/mshick/markdown-it-imgix
export default function (md, options) {
  function mapSrc (profiles) {
    return function (token) {
      if (token.type === 'image') {
        const srcIndex = token.attrIndex('src')
        const src = getAttr(token, 'src')
        const width = getAttr(token, 'width')
        const height = getAttr(token, 'height')
        for (const profile of profiles) {
          if (!profile.match || !profile.prefix) {
            continue
          }
          if (startWith(src, profile.match)) {
            if (width && height) {
              profile.params = Object.assign({}, profile.params, {w: width, h: height})
            }

            token.attrs[srcIndex][1] = profile.prefix + src
          }
        }
      }
      return token
    }
  }

  function getAttr (token, attr) {
    const idx = token.attrIndex(attr)
    if (idx !== -1) {
      return token.attrs[idx][1]
    }
  }

  function startWith (str, prefix) {
    return str && prefix && str.indexOf(prefix) === 0
  }

  const profiles = Array.isArray(options) ? options : [options]
  const defaultRenderer = md.renderer.rules.image
  md.renderer.rules.image = function (tokens, idx, opt, env, self) {
    tokens = tokens.map(mapSrc(profiles))
    return defaultRenderer(tokens, idx, opt, env, self)
  }
}
