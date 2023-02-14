#! /usr/bin/env node
import extract from 'extract-zip'
import fs, { readdir } from 'fs'
import https from 'https'
import path from 'path'

const zip = './ramidus.zip'

const pkgJSON = `{
  "scripts": {
    "build": "node @/build.js",
    "dev": "npx http-server"
  }
}`

const rm = (path) =>
  fs.unlink(path, function (err) {
    err && console.log(err)
  })

const file = fs.createWriteStream(zip)

https
  .get(
    'https://codeload.github.com/jameslovallo/ramidus/zip/refs/heads/main',
    (response) => {
      response.pipe(file)
      file.on('finish', () => {
        file.close(async () => {
          try {
            await extract(zip, { dir: path.resolve('./') })
            rm(zip)
            readdir('./', { withFileTypes: true }, (err, items) => {
              if (err) {
                console.log(err)
              } else if (items) {
                const dir = items.filter((item) => item.isDirectory())[0].name
                fs.cp(`./${dir}`, './', { recursive: true }, function (err) {
                  err && console.log(err)
                  fs.rm(dir, { recursive: true })
                  fs.rm('./node_modules', { recursive: true })
                  rm('.gitignore')
                  rm('./bin.js')
                  rm('./package.json')
                  fs.writeFile(
                    './package.json',
                    pkgJSON,
                    (err) => err && console.error(err)
                  )
                })
              }
            })
          } catch (err) {
            err && console.log(err)
          }
        })
      })
    }
  )
  .on('error', (err) => {
    rm(zip)
  })
