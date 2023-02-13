const components = [
  'app-footer',
  'app-layout',
  'app-nav',
  'spa-link',
  'spa-router',
]

// fade in gracefully when components are loaded
components.forEach((c) => import(`/@/components/${c}.js`))
const settled = components.map((c) => customElements.whenDefined(c))
await Promise.allSettled(settled)
document.body.style.opacity = 1
