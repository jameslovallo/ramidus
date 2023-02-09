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
      margin: 0 auto;
      max-width: 70ch;
      padding: 1rem 1rem 4rem;
    }
  `,
})
