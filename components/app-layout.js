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
  createTag(target, type, attrs) {
    const tag = document.createElement(type)
    Object.keys(attrs).forEach((key) => {
      tag[key] = attrs[key]
    })
    target.appendChild(tag)
  },
  ready() {
    this.createTag(document.head, 'meta', {
      name: 'viewport',
      content: 'width=device-width, initial-scale=1',
    })
    this.createTag(document.head, 'link', {
      href: '/style.css',
      rel: 'stylesheet',
    })
  },
  css: /* css */ `
    main {
      margin: 0 auto;
      max-width: 70ch;
      padding: 1rem 1rem 4rem;
    }
  `,
})
