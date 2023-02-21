import ardi, { html } from '//cdn.skypack.dev/ardi'

ardi({
  tag: 'spa-root',
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
    // check if page is prebuilt
    const prebuilt = document.querySelector('meta[name=prebuilt][content=true]')
    // handle head
    if (firstLoad && !prebuilt && !this.headSet) {
      this.setHead()
      this.headSet = true
    }
    // allow page to request native loading
    if (doc.includes('<!-- spa-reload -->')) {
      if (!sessionStorage.getItem('spa-reload')) {
        sessionStorage.setItem('spa-reload', true)
        location = path
        return
      }
    } else sessionStorage.removeItem('spa-reload')
    // handle markdown
    if (
      (firstLoad && document.body.lang === 'md') ||
      doc.trim().startsWith('<!-- md -->')
    ) {
      this.handleMD(doc)
    } else document.body.innerHTML = doc
    !firstLoad && document.body.removeAttribute('lang')
    // handle page title
    this.handleTitle(doc)
    // highlight code blocks
    if (doc.includes('```') || doc.includes('language-')) this.highlight()
  },
  handleTitle(doc) {
    let mdH1 = doc.match(/# .+/)
    if (mdH1) mdH1 = mdH1[0].replace('# ', '')
    let htmlH1 = doc.match(/<h1.+<\/h1>/)
    if (htmlH1) htmlH1 = htmlH1[0].replace(/<h1.*?>/, '').replace('</h1>', '')
    let htmlTitle = doc.match(/<title>.+<\/title>/)
    if (htmlTitle)
      htmlTitle = [0].replace('<title>', '').replace('</title>', '')
    document.title = htmlTitle || htmlH1 || mdH1
  },
  handleMD(doc) {
    doc = doc
      .replaceAll('&amp;', '&')
      .replaceAll('&lt;', '<')
      .replaceAll('&gt;', '>')
    import('//unpkg.com/marked@4.2.12/lib/marked.esm.js').then((marked) => {
      document.body.innerHTML = marked.parse(doc, {
        gfm: true,
      })
    })
  },
  highlight() {
    import('//cdn.skypack.dev/prismjs').then((prism) => {
      prism.highlightAllUnder(document.body)
    })
    if (!this.prismCssLoaded) {
      this.createTag(document.head, 'link', {
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
    const firstPageIsMD = document.body.lang === 'md'
    this.pushHistory(
      location.pathname,
      (firstPageIsMD ? '<!-- md -->' : '') + document.body.innerHTML
    )
    firstPageIsMD && document.body.removeAttribute('lang')
    addEventListener('popstate', (e) => {
      this.setPage(sessionStorage.getItem(e.state.path), e.state.path)
    })
  },
})
