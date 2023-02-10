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
  pushHistory(href) {
    history.pushState({ page: href }, '', href.replace('index.html', ''))
  },
  pagePath() {
    return (this.href !== '/' ? this.href : '') + '/index.html'
  },
  getPage(setPage) {
    if (!this.pageData) {
      fetch(this.pagePath())
        .then((res) => res.text())
        .then((html) => {
          this.pageData = html
            .split('<app-layout>')[1]
            .split('</app-layout>')[0]
          setPage && this.setPage()
        })
    }
  },
  setPage() {
    if (this.pageData) {
      router.setPage(this.pageData)
      this.pushHistory(this.pagePath())
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
