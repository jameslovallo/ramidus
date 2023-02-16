import ardi, { html } from '//cdn.skypack.dev/ardi'

const nav = [
  { href: '/', label: html`<img src="/@/assets/ardi.svg" />` },
  { href: '/', label: 'Home' },
  { href: '/docs', label: 'Docs' },
]

ardi({
  tag: 'app-nav',
  template() {
    return html`
      <style>
        ${this.css}
      </style>
      <nav>
        ${nav.map(
          (page) => html`<spa-link href=${page.href}>${page.label}</spa-link>`
        )}
      </nav>
    `
  },
  css: /* css */ `
    nav {
      box-shadow: 0 0 3px rgba(0,0,0,0.25);
      display: flex;
      gap: 1rem;
      padding: 0 1rem;
    }
    @media (prefers-color-scheme: dark) {
      nav {
        border-bottom: 1px solid var(--surface);
      }
    }
    spa-link:first-of-type {
      margin-right: auto;
      padding: .75rem 0;
    }
    spa-link:first-of-type img {
      width:32px;
    }
    spa-link::part(link) {
      align-items: center;
      color: inherit;
      display: flex;
      height: 100%;
      text-decoration: none;
    }
  `,
})
