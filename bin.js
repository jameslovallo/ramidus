#! /usr/bin/env node
import exec from 'child_process'
import extract from 'extract-zip'
import fs from 'fs'
import https from 'https'
import path from 'path'

const zip = './ramidus.zip'

const pkg = `{
  "type": "module",
  "scripts": {
    "build": "node @/build.js",
    "dev": "npx browser-sync --files '**/*'"
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
    function (response) {
      response.pipe(file)
      file.on('finish', function () {
        file.close(async function () {
          try {
            await extract(zip, { dir: path.resolve('./') })
            deleteFile(zip)
            fs.cp('./ramidus-main', './', { recursive: true }, function (err) {
              err && console.log(err)
              deleteFolder('./ramidus-main')
              deleteFile('.gitignore')
              deleteFile('./bin.js')
              fs.writeFile('./package.json', pkg, function (err) {
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
  .on('error', function (err) {
    rm(zip)
  })

exec('npm run dev')
