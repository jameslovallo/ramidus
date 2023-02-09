document.head.innerHTML += /* html */ `<link href="/style.css" rel="stylesheet" />`
window.router = document.querySelector('spa-router')
window.nav = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
]

import '/components/app-footer.js'
import '/components/app-layout.js'
import '/components/app-nav.js'
import '/components/spa-link.js'
import '/components/spa-router.js'
