import { exec } from 'child_process'
import fs from 'fs'
import path from 'path'
import headJSON from './head.js'

fs.rmSync('./dist', { recursive: true, force: true })

const doc = (head, body) => `
<!DOCTYPE html>
<html lang="en-us">
${head.trim()}
${body.trim()}
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

const getFile = (path) =>
  fs.readFileSync(path, { encoding: 'utf8' }, (err, data) =>
    err ? console.log(err) : data
  )

function buildHTML(startPath, filter) {
  if (!fs.existsSync(startPath)) {
    console.log('directory does not exist: ', startPath)
    return
  }

  const files = fs.readdirSync(startPath)
  for (var i = 0; i < files.length; i++) {
    var filename = path.join(startPath, files[i])
    var stat = fs.lstatSync(filename)
    if (stat.isDirectory()) {
      buildHTML(filename, filter) //recurse
    } else if (filename.endsWith(filter)) {
      let file = getFile(filename)
      let body = file.replace(
        '<body',
        '<body style="opacity: 0; transition: opacity .5s;"'
      )
      fs.writeFileSync(filename, doc(head, body).trim(), {
        encoding: 'utf8',
      })
    }
  }
}

const excludes = [
  '.git',
  '@/build.js',
  'bin.js',
  'node_modules',
  'package-lock.json',
  'package.json',
  '.netlify',
]
  .map((e) => `--exclude "${e}"`)
  .join(' ')

exec(`rsync -a ${excludes} ./ ./dist/`, (error, stdout, stderr) => {
  if (error) {
    console.log(`error: ${error.message}`)
    return
  }
  if (stderr) {
    console.log(`stderr: ${stderr}`)
    return
  }
  console.log(`stdout: ${stdout}`)
  if (!error && !stderr) buildHTML('./dist/', 'index.html')
})
