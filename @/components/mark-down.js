import { parse } from 'https://unpkg.com/marked@4.3.0/lib/marked.esm.js'
import ardi from '//unpkg.com/ardi'

const codeToMd = (lang, code) => `
\`\`\`${lang}
${code}
\`\`\`
`

ardi({
  tag: 'mark-down',
  shadow: false,
  props: {
    src: [String, '/README.md'],
  },
  getMarkdown() {
    fetch(this.src)
      .then((res) => res.text())
      .then((text) => {
        const nameArray = this.src.split('.')
        const lang = nameArray[nameArray.length - 1]
        let md = lang === 'md' ? text : codeToMd(lang, text)
        this.root.innerHTML = parse(md)
        const hasCodeBlocks = md.includes('```')
        if (hasCodeBlocks) {
          import('https://cdn.skypack.dev/prismjs@1.29.0')
          if (!window.prismThemeLoaded) {
            const prismLink = document.createElement('link')
            prismLink.rel = 'stylesheet'
            prismLink.href =
              'https://unpkg.com/prism-themes@1.9.0/themes/prism-dracula.min.css'
            document.head.appendChild(prismLink)
            window.prismThemeLoaded = true
          }
        }
      })
  },
  created() {
    this.getMarkdown()
  },
  changed(prop) {
    if (prop.name === 'src' && prop.old && prop.new) {
      this.getMarkdown()
    }
  },
})
