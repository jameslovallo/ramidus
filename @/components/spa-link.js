import ardi, { html } from '/@/ardi.js'

ardi({
  component: 'spa-link',
  props: { href: [String, '/home.html'] },
  state: () => ({ pageData: '' }),
  template() {
    return html`
      <a
        part="link"
        href=${this.href}
        @mouseover=${(e) => this.hover(e)}
        @click=${(e) => this.click(e)}
      >
        <slot></slot>
      </a>
    `
  },
  pagePath() {
    return (this.href !== '/' ? this.href : '') + '/index.html'
  },
  getPage(setPage) {
    if (!this.pageData) {
      fetch(this.pagePath())
        .then((res) => res.text())
        .then((html) => {
          this.pageData = html.split(/<body.+>/g)[1].split(`</body>`)[0]
          setPage && this.setPage()
        })
    }
  },
  setPage() {
    if (this.pageData) {
      appSlot.setPage(this.pageData, this.href)
      appSlot.pushHistory(this.href, this.pageData)
    } else this.getPage(true)
  },
  hover(e) {
    e.preventDefault()
    this.getPage()
  },
  click(e) {
    e.preventDefault()
    sessionStorage.removeItem('spa-reload')
    this.setPage()
  },
})
