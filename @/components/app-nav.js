import ardi, { html } from '//unpkg.com/ardi'

const nav = [
  { href: '/', label: 'Home' },
  { href: '/docs', label: 'Docs' },
]

ardi({
  tag: 'app-nav',
  template() {
    return html`
      <nav>
        <a is="app-link" href="/">
          <img
            src="/@/assets/ardi.svg"
            alt="Ardi Logo, a cute monkey in a spacesuit."
          />
        </a>
        ${nav.map(
          (page) => html`<a is="app-link" href=${page.href}>${page.label}</a>`
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
    a {
      align-items: center;
      color: inherit;
      display: flex;
      min-height: 100%;
      text-decoration: none;
    }
    a:first-of-type {
      margin-right: auto;
      padding: 0;
    }
    a:first-of-type img {
      margin: 1rem 0;
      width: 3rem;
    }
  `,
})
