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
  ready() {
    const viewport = document.createElement('meta')
    viewport.name = 'viewport'
    viewport.content = 'width=device-width, initial-scale=1'
    document.head.innerHTML += `
      <link href="/style.css" rel="stylesheet" />
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
