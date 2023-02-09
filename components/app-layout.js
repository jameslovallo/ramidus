import ardi, { html } from 'https://unpkg.com/ardi'

ardi({
  component: 'app-layout',
  state: () => ({ pageData: '' }),
  template() {
    return html`
      <style>
        ${this.css}
      </style>
      <app-nav></app-nav>
      <main>
        <spa-router>
          <slot></slot>
        </spa-router>
      </main>
      <app-footer></app-footer>
    `
  },
  css: /* css */ `
    main {
      margin: 0 auto 5rem;
      max-width: 70ch;
      padding: 0 1rem;
    }
  `,
})
