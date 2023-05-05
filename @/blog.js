import fs from 'fs'
import matter from 'gray-matter'
import { parse } from 'marked'
import path from 'path'
import headJSON from './head.js'

const doc = (head, body) => `
<!DOCTYPE html>
<html lang="en-us">
${head.trim()}
<body>
<app-layout>
${body.trim()}
</app-layout>
<script src="/@/main.js" type="module"></script>
</body>
</html>`

const head = `
<!-- Built ${new Date().toLocaleDateString()} -->
<head>
  <meta name="prebuilt" content="true">
  ${Object.keys(headJSON)
    .map((tagType) =>
      headJSON[tagType]
        .map(
          (el) =>
            `<${tagType} ${Object.keys(el)
              .map((attr) => `${attr}="${el[attr]}"`)
              .join(' ')}>`
        )
        .join('\n\t')
    )
    .join('\n\t')}
</head>`

const startPath = './dist/@/posts/'
const posts = fs.readdirSync(startPath)

const getFile = (path) =>
  fs.readFileSync(path, { encoding: 'utf8' }, (err, data) =>
    err ? console.log(err) : data
  )

// fs.mkdirSync('./dist/blog')

const blogIndex = []

posts.forEach((post) => {
  const filePath = path.join(startPath, post)
  const stat = fs.lstatSync(filePath)
  if (!stat.isDirectory() && post.endsWith('.md')) {
    const text = getFile(filePath)
    const grayMatter = matter(text)
    const content = parse(grayMatter.content)
    const outPath = './dist/blog/' + post.replace('.md', '').toLowerCase()
    const outName = outPath + '/index.html'
    const pubName = outName.replace('./dist', '')
    fs.mkdirSync(outPath)
    fs.writeFileSync(outName, doc(head, content).trim(), {
      encoding: 'utf8',
    })
    blogIndex.push({ href: pubName, ...grayMatter.data })
  }
})

fs.writeFileSync(
  './dist/@/posts/index.js',
  'export default ' + JSON.stringify(blogIndex),
  {
    encoding: 'utf8',
  }
)
