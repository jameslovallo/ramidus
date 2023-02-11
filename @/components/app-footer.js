import ardi, { html } from 'https://unpkg.com/ardi'

ardi({
  component: 'app-footer',
  template() {
    const year = new Date().getFullYear()
    return html`
      <style>
        ${this.css}
      </style>
      <footer>
        <p>© ${year} James Lovallo</p>
      </footer>
    `
  },
  css: /* css */ `
    :host {
      background: var(--surface);
      display: block;
      left: 0;
      padding: 1rem 1rem;
      position: sticky;
      text-align: center;
      top: 100vh;
    }
  `,
})
