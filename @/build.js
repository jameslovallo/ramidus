const path = require('path')
const fs = require('fs')
const head = require('./head.json')

const pageHead = `<head>
<meta name="prebuilt" content="true">
  ${Object.keys(head)
    .map((tagType) =>
      head[tagType]
        .map(
          (el) =>
            `<${tagType} ${Object.keys(el)
              .map((attr) => `${attr}="${el[attr]}"`)
              .join(' ')}>`
        )
        .join('')
    )
    .join('')}
</head>`

const getFile = (path) =>
  fs.readFileSync(path, { encoding: 'utf8' }, (err, data) =>
    err ? console.log(err) : data
  )

function fromDir(startPath, filter) {
  if (!fs.existsSync(startPath)) {
    console.log('directory does not exist: ', startPath)
    return
  }

  const files = fs.readdirSync(startPath)
  for (var i = 0; i < files.length; i++) {
    var filename = path.join(startPath, files[i])
    var stat = fs.lstatSync(filename)
    if (stat.isDirectory()) {
      fromDir(filename, filter) //recurse
    } else if (filename.endsWith(filter)) {
      const file = getFile(filename)
      fs.writeFileSync(
        filename,
        `
${pageHead}

<body>
${file}
</body>`,
        {
          encoding: 'utf8',
        }
      )
    }
  }
}

fromDir('./', '.html')
