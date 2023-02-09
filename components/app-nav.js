import ardi, { html } from 'https://unpkg.com/ardi'

ardi({
  component: 'app-nav',
  template() {
    return html`
      <nav>
        ${nav.map(
          (page) => html`<spa-link href=${page.href}>${page.label}</spa-link>`
        )}
      </nav>
      <style>
        ${this.css}
      </style>
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
    }
    spa-link::part(link) {
      color: inherit;
      display: inline-block;
      padding: 1rem 0;
      text-decoration: none;
    }
  `,
})
