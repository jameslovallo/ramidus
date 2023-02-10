import ardi, { html } from 'https://unpkg.com/ardi'

ardi({
  component: 'spa-router',
  template() {
    return html`<slot></slot>`
  },
  parse(text, firstLoad) {
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
    } else if (!firstLoad) {
      this.innerHTML = text
    }
  },
  highlight() {
    import('https://cdn.skypack.dev/prismjs').then((prism) => {
      prism.highlightAllUnder(router)
    })
    this.createTag(layout.shadowRoot, 'link', {
      rel: 'stylesheet',
      href: '/@/prism.css',
    })
  },
  setPage(pageData) {
    if (pageData) this.parse(pageData)
    this.setTitle()
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
  ready() {
    this.createTag(document.head, 'meta', {
      name: 'viewport',
      content: 'width=device-width, initial-scale=1',
    })
    this.createTag(document.head, 'link', {
      href: '/@/style.css',
      rel: 'stylesheet',
    })
    window.router = this
    this.setTitle()
    this.parse(layout.innerHTML, true)
    // history stuff
    const href = location.pathname
    history.pushState({ page: href }, '', href.replace('index.html', ''))
    addEventListener('popstate', (e) => {
      if (e.state.page) this.setPage(e.state.page, false)
    })
  },
})
