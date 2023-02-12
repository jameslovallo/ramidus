import ardi, { html } from 'https://unpkg.com/ardi'

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
          const tag = layout.tagName.toLowerCase()
          this.pageData = html.split(`<${tag}>`)[1].split(`</${tag}>`)[0]
          setPage && this.setPage()
        })
    }
  },
  setPage() {
    if (this.pageData) {
      router.setPage(this.pageData, this.href)
      router.pushHistory(this.href, this.pageData)
    } else this.getPage(true)
  },
  hover(e) {
    e.preventDefault()
    this.getPage()
  },
  click(e) {
    e.preventDefault()
    this.setPage()
  },
})
