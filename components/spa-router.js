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
      this.innerHTML = this.pageData
      this.pageData = ''
    } else this.getPage(href, true)
  },
  ready() {
    window.router = this
    const href = location.pathname
    history.pushState({ page: href }, '', href.replace('index.html', ''))
    addEventListener('popstate', (e) => {
      if (e.state.page) this.setPage(e.state.page, false)
    })
  },
})
