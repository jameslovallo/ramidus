import ardi, { html } from 'https://unpkg.com/ardi'

ardi({
  component: 'app-footer',
  template() {
    const year = new Date().getFullYear()
    return html`
      <footer>
        <p>© ${year} James Lovallo</p>
      </footer>
      <style>
        ${this.css}
      </style>
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
