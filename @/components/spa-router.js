import ardi, { html } from 'https://unpkg.com/ardi'

ardi({
  component: 'spa-router',
  template() {
    return html`<slot></slot>`
  },
  setHead() {
    fetch('/@/head.json')
      .then((res) => res.json())
      .then((data) => {
        Object.keys(data).forEach((tagType) => {
          data[tagType].forEach((el) => {
            this.createTag(document.head, tagType, el)
          })
        })
      })
  },
  setPage(doc, path, firstLoad) {
    const prebuilt = document.querySelector('meta[name=prebuilt][content=true]')
    if (firstLoad && !prebuilt) this.setHead()
    if (doc.includes('<!-- spa-reload -->')) {
      if (!sessionStorage.getItem('spa-reload')) {
        sessionStorage.setItem('spa-reload', true)
        location = path
        return
      }
    } else sessionStorage.removeItem('spa-reload')
    if (doc.trim().startsWith('#')) {
      this.handleMD(doc)
    } else if (!firstLoad) this.innerHTML = doc
    this.setTitle()
  },
  handleMD(doc) {
    import('https://unpkg.com/marked@4.2.12/lib/marked.esm.js').then(
      (marked) => {
        this.innerHTML = marked.parse(
          doc
            .split('\n')
            .map((line) => line.trim())
            .join('\n'),
          { gfm: true, highlight: this.highlight() }
        )
      }
    )
  },
  highlight() {
    import('https://cdn.skypack.dev/prismjs').then((prism) => {
      prism.highlightAllUnder(router)
    })
    if (!this.prismCssLoaded) {
      this.createTag(layout.shadowRoot, 'link', {
        rel: 'stylesheet',
        href: '/@/css/prism.css',
      })
      this.prismCssLoaded = true
    }
  },
  setTitle() {
    let children = this.children
    if (children.length === 1 && children[0].tagName === 'SLOT') {
      children = this.children[0].assignedElements()
    }
    const titleEl = [...children].filter((el) =>
      ['TITLE', 'H1'].includes(el.tagName)
    )[0]
    if (titleEl) document.title = titleEl.innerText
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
    window.router = this
    this.setPage(layout.innerHTML, location.pathname, true)
    // history stuff
    this.pushHistory(location.pathname, layout.innerHTML)
    addEventListener('popstate', (e) => {
      this.setPage(sessionStorage.getItem(e.state.path), e.state.path)
    })
  },
})
