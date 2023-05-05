// load all components
const components = [
  'app-root',
  'app-link',
  'app-layout',
  'app-nav',
  'app-footer',
  'mark-down',
  'tree-icon',
]
components.forEach((c) => import(`/@/components/${c}.js`))

// fade in gracefully when components are loaded
const isDefined = ['app-link', 'app-root', ...components].map((c) =>
  customElements.whenDefined(c)
)
await Promise.allSettled(isDefined)
document.body.style.opacity = 1
