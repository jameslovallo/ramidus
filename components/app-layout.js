import ardi, { html } from 'https://unpkg.com/ardi'

ardi({
  component: 'app-layout',
  state: () => ({ pageData: '' }),
  template() {
    return html`
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <style>
          ${this.css}
        </style>
      </head>
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
