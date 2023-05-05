import ardi, { css, html } from '//unpkg.com/ardi'

ardi({
  tag: 'app-footer',
  template() {
    return html`
      <footer>
        <p>&copy; Tina Ramidus</p>
        <p>
          Made with <a href="https://ardi.netlify.app">Ardi</a> and
          <a href="https://ardi.netlify.app/ramidus">Ramidus</a>
        </p>
      </footer>
    `
  },
  styles: css`
    :host {
      background: var(--surface);
      display: block;
      left: 0;
      padding: 1rem 1rem;
      position: sticky;
      text-align: center;
      top: 100vh;
    }
    a {
      color: unset;
      text-decoration-color: var(--theme-color);
    }
  `,
})
