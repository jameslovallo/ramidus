#! /usr/bin/env node
import extract from 'extract-zip'
import fs from 'fs'
import https from 'https'
import path from 'path'

const zip = './ramidus.zip'

const pkgJSON = `{
  "scripts": {
    "build": "node @/build.js",
    "dev": "npx http-server"
  }
}`

const deleteFile = (path) => {
  fs.unlink(path, function (err) {
    err && console.log(err)
  })
}

const deleteFolder = (path) => {
  fs.rm(path, { recursive: true }, function (err) {
    err && console.log(err)
  })
}

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
            deleteFile(zip)
            fs.cp('./ramidus-main', './', { recursive: true }, function (err) {
              err && console.log(err)
              deleteFolder('./ramidus-main')
              deleteFolder('./node_modules')
              deleteFile('.gitignore')
              deleteFile('./bin.js')
              deleteFile('./package.json')
              fs.writeFile('./package.json', pkgJSON, function (err) {
                err && console.error(err)
              })
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
