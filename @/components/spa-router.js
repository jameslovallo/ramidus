import ardi, { html } from 'https://unpkg.com/ardi'

ardi({
  component: 'spa-router',
  state: () => ({ pageData: '' }),
  template() {
    return html`<slot></slot>`
  },
  getPage(href, setPage) {
    fetch(href)
      .then((res) => res.text())
      .then((html) => {
        this.pageData = html.split('<app-layout>')[1].split('</app-layout>')[0]
        if (setPage) this.setPage(href)
      })
  },
  setPage(href) {
    if (this.pageData) {
      this.parse(this.pageData)
      this.pageData = ''
    } else this.getPage(href, true)
    this.setTitle()
  },
  parse(text) {
    if (text.trim().startsWith('#')) {
      import('https://unpkg.com/marked@4.2.12/lib/marked.esm.js').then((m) => {
        text = text
          .split('\n')
          .map((line) => line.trim())
          .join('\n')
        text = m.parse(text)
        this.innerHTML = text
      })
    } else this.innerHTML = text
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
    this.parse(document.querySelector('app-layout').innerHTML)
    // history stuff
    const href = location.pathname
    history.pushState({ page: href }, '', href.replace('index.html', ''))
    addEventListener('popstate', (e) => {
      if (e.state.page) this.setPage(e.state.page, false)
    })
  },
})
