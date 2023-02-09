import ardi, { html } from 'https://unpkg.com/ardi'

ardi({
  component: 'app-footer',
  template() {
    return html`
      <footer>Copyright James Lovallo</footer>
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
      padding: 2rem 1rem;
			position: sticky;
			text-align: center;
			top: 100vh;
    }
  `,
})
