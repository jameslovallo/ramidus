import ardi, { html } from '//cdn.skypack.dev/ardi'

ardi({
  tag: 'spa-slot',
  template() {
    return html`<slot></slot>`
  },
  setHead() {
    fetch('/@/head.json')
      .then((res) => res.json())
      .then((data) => {
        Object.keys(data).forEach((tagType) => {
          data[tagType].forEach((el) => {
            this.createTag(document.head, tagType, el)
          })
        })
      })
  },
  setPage(doc, path, firstLoad) {
    const prebuilt = document.querySelector('meta[name=prebuilt][content=true]')
    if (firstLoad && !prebuilt) this.setHead()
    if (doc.includes('<!-- spa-reload -->')) {
      if (!sessionStorage.getItem('spa-reload')) {
        sessionStorage.setItem('spa-reload', true)
        location = path
        return
      }
    } else sessionStorage.removeItem('spa-reload')
    if (
      (firstLoad && document.body.lang === 'md') ||
      doc.startsWith('<!-- md -->')
    ) {
      this.handleMD(doc)
      document.body.removeAttribute('lang')
    } else this.innerHTML = doc
    this.handleTitle()
  },
  handleTitle(doc) {
    const mdH1 = doc.match(/# .+/)[0].replace('# ', '')
    const htmlH1 = doc
      .match(/<h1>.+<\/h1>/)[0]
      .replace('<h1>', '')
      .replace('</h1>', '')
    const htmlTitle = doc
      .match(/<title>.+<\/title>/)[0]
      .replace('<title>', '')
      .replace('</title>', '')
    document.title = htmlTitle || htmlH1 || mdH1
  },
  handleMD(doc) {
    doc = doc
      .replaceAll('&amp;', '&')
      .replaceAll('&lt;', '<')
      .replaceAll('&gt;', '>')
    import('//unpkg.com/marked@4.2.12/lib/marked.esm.js').then((marked) => {
      this.innerHTML = marked.parse(doc, {
        gfm: true,
        highlight:
          doc.includes('```') || doc.includes('language-')
            ? this.highlight()
            : undefined,
      })
    })
  },
  highlight() {
    import('//cdn.skypack.dev/prismjs').then((prism) => {
      prism.highlightAllUnder(this)
    })
    if (!this.prismCssLoaded) {
      this.createTag(document.body.shadowRoot, 'link', {
        rel: 'stylesheet',
        href: '/@/css/prism.css',
      })
      this.prismCssLoaded = true
    }
  },
  createTag(target, type, attrs) {
    const tag = document.createElement(type)
    Object.keys(attrs).forEach((key) => {
      tag[key] = attrs[key]
    })
    target.appendChild(tag)
  },
  pushHistory(href, data) {
    history.pushState(
      { path: href.replace('index.html', '') },
      undefined,
      href.replace('index.html', '')
    )
    if (!sessionStorage[href]) sessionStorage[href] = data
  },
  ready() {
    window.appSlot = this
    this.setPage(document.body.innerHTML, location.pathname, true)
    // history stuff
    this.pushHistory(location.pathname, document.body.innerHTML)
    addEventListener('popstate', (e) => {
      this.setPage(sessionStorage.getItem(e.state.path), e.state.path)
    })
  },
})
