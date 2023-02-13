import ardi, { html } from 'https://unpkg.com/ardi'

ardi({
  component: 'app-layout',
  state: () => ({ pageData: '' }),
  template() {
    return html`
      <style>
        main {
          margin: 0 auto;
          max-width: 70ch;
          padding: 1rem 1rem 4rem;
        }
      </style>
      <app-nav></app-nav>
      <main>
        <spa-slot>
          <slot></slot>
        </spa-slot>
      </main>
      <app-footer></app-footer>
    `
  },
})
