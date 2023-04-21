import ardi, { html } from '//unpkg.com/ardi'
import headJSON from '/@/head.js'

ardi({
  tag: 'app-root',
  template() {
    return html`<slot></slot>`
  },
  setHead() {
    Object.keys(headJSON).forEach((tagType) => {
      headJSON[tagType].forEach((el) => {
        this.createTag(document.head, tagType, el)
      })
    })
  },
  async setPage(doc, path, init) {
    // check if page is prebuilt
    const prebuilt = document.querySelector('meta[name=prebuilt][content=true]')
    // handle head
    if (init && !prebuilt) {
      this.setHead()
    }
    // allow page to request native loading
    if (doc.includes('<!-- spa-reload -->')) {
      if (!sessionStorage.getItem('spa-reload')) {
        sessionStorage.setItem('spa-reload', true)
        location = path
        return
      }
    } else sessionStorage.removeItem('spa-reload')
    // set page content
    this.appLayout.innerHTML = doc
    document.title = document.querySelector('h1').innerText
    // build layout classList
    const pathArray = path.split('/')
    const pageClass = pathArray[1] || 'home'
    const pageLevel = 'level-' + pathArray.filter((i) => i.length).length
    this.appLayout.classList = `${pageClass} ${pageLevel}`
    // handle scripts
    this.appLayout.querySelectorAll('script').forEach((tag) => {
      const newTag = document.createElement('script')
      newTag.src = tag.src
      newTag.type = tag.type
      tag.innerHTML && Function(tag.innerHTML)()
      tag.replaceWith(newTag)
    })
  },
  createTag(target, type, attrs) {
    const tag = document.createElement(type)
    Object.keys(attrs).forEach((key) => {
      tag[key] = attrs[key]
    })
    target.appendChild(tag)
  },
  pushHistory(href, data) {
    history.pushState(
      { path: href.replace('index.html', '') },
      undefined,
      href.replace('index.html', '')
    )
    if (!sessionStorage[href]) sessionStorage[href] = data
  },
  ready() {
    if (!window.ramidusInitialized) {
      window.appRoot = this
      this.appLayout = document.querySelector('app-layout')
      this.setPage(this.appLayout.innerHTML, location.pathname, true)
      // history stuff
      this.pushHistory(location.pathname, this.appLayout.innerHTML)
      addEventListener('popstate', (e) => {
        if (e.state.path) {
          this.setPage(sessionStorage.getItem(e.state.path), e.state.path)
        }
      })
      window.ramidusInitialized = true
    }
  },
})
