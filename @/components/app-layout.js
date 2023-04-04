import ardi, { html } from '//cdn.skypack.dev/ardi'

ardi({
  tag: 'app-layout',
  template() {
    return html`
      <style>
        main {
          margin: 0 auto;
          max-width: 70ch;
          padding: 0 1rem 4rem;
        }
      </style>
      <app-nav></app-nav>
      <main>
        <spa-root>
          <slot></slot>
        </spa-root>
      </main>
      <app-footer></app-footer>
    `
  },
})
