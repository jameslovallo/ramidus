import ardi, { html } from '//unpkg.com/ardi'

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
        <app-root>
          <slot></slot>
        </app-root>
      </main>
      <app-footer></app-footer>
    `
  },
})
