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
              .join('\n')
          )
        }
      )
    } else if (!firstLoad) {
      this.innerHTML = text
    }
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
  ready() {
    window.router = this
    this.setTitle()
    this.parse(document.querySelector('app-layout').innerHTML, true)
    // history stuff
    const href = location.pathname
    history.pushState({ page: href }, '', href.replace('index.html', ''))
    addEventListener('popstate', (e) => {
      if (e.state.page) this.setPage(e.state.page, false)
    })
  },
})
