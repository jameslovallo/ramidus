import ardi, { html } from 'https://unpkg.com/ardi'

ardi({
  component: 'spa-link',
  props: { href: [String, '/home.html'] },
  template() {
    return html`
      <a
        part="link"
        href=${this.href}
        @mouseover=${(e) => this.hover(e)}
        @mouseleave=${() => (router.pageData = '')}
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
  hover(e) {
    e.preventDefault()
    router.getPage(this.pagePath())
  },
  click(e) {
    e.preventDefault()
    router.setPage(this.pagePath())
    this.pushHistory(this.pagePath())
  },
})
