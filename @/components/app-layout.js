import ardi, { html } from '/@/ardi.js'

ardi({
  component: 'app-layout',
  extends: [HTMLBodyElement, 'body'],
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
