import ardi, { html } from 'https://unpkg.com/ardi'

ardi({
  component: 'spa-router',
  template() {
    return html`<slot></slot>`
  },
  setPage(text, path, firstLoad) {
    if (text.includes('<!-- native-load -->')) {
      const reload = sessionStorage.getItem('native-reload')
      if (!reload) {
        sessionStorage.setItem('native-reload', true)
        location = path
        return
      }
    } else sessionStorage.removeItem('native-reload')
    if (text.trim().startsWith('#')) {
      import('https://unpkg.com/marked@4.2.12/lib/marked.esm.js').then(
        (marked) => {
          this.innerHTML = marked.parse(
            text
              .split('\n')
              .map((line) => line.trim())
              .join('\n'),
            { gfm: true, highlight: this.highlight() }
          )
        }
      )
    } else if (!firstLoad) this.innerHTML = text
    this.setTitle()
  },
  highlight() {
    import('https://cdn.skypack.dev/prismjs').then((prism) => {
      prism.highlightAllUnder(router)
    })
    if (!this.prismCssLoaded) {
      this.createTag(layout.shadowRoot, 'link', {
        rel: 'stylesheet',
        href: '/@/prism.css',
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
    // setup the page
    this.createTag(document.head, 'meta', {
      name: 'viewport',
      content: 'width=device-width, initial-scale=1',
    })
    this.createTag(document.head, 'link', {
      rel: 'stylesheet',
      href: '/@/style.css',
    })
    this.createTag(document.head, 'link', {
      rel: 'icon',
      href: '/@/assets/favicon.svg',
    })
    window.router = this
    this.setPage(layout.innerHTML, location.pathname, true)
    // history stuff
    this.pushHistory(location.pathname, layout.innerHTML)
    addEventListener('popstate', (e) => {
      this.setPage(sessionStorage.getItem(e.state.path), e.state.path)
    })
  },
})
