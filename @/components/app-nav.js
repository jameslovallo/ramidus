import nav from '../nav.js'
import ardi, { css, html } from '//unpkg.com/ardi'

ardi({
  tag: 'app-nav',
  template() {
    return html`
      <nav>
        <app-link preload="true">
          <a href="/">
            <img
              src="/@/assets/ardi.svg"
              alt="Ardi Logo, a cute monkey in a spacesuit."
            />
          </a>
        </app-link>
        ${nav.map(
          (page) => html`
            <app-link preload="true">
              <a href=${page.href}>${page.label}</a>
            </app-link>
          `
        )}
      </nav>
    `
  },
  styles: css`
    nav {
      box-shadow: 0 0 3px rgba(0, 0, 0, 0.25);
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
    app-link:first-of-type {
      margin-right: auto;
    }
    a:first-of-type img {
      margin: 1rem 0;
      width: 3rem;
    }
  `,
})
