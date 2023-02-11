import ardi, { html } from 'https://unpkg.com/ardi'

ardi({
  component: 'app-nav',
  template() {
    return html`
      <style>
        ${this.css}
      </style>
      <nav>
        <spa-link href="/">Home</spa-link>
        <spa-link href="/about">About</spa-link>
        <spa-link href="/docs">Docs</spa-link>
        <a href="/demo">Demo</a>
        <spa-link href="/contact">Contact</spa-link>
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
    }
    spa-link::part(link),
    a {
      color: inherit;
      display: inline-block;
      padding: 1rem 0;
      text-decoration: none;
    }
  `,
})
