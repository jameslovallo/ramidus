#! /usr/bin/env node
import extract from 'extract-zip'
import fs from 'fs'
import https from 'https'
import path from 'path'

const starter = process.argv[3]
const repos = {
  base: 'ramidus',
  blog: 'ramidus-starter--blog',
}

const repo = starter ? repos[starter] : repos.base
const folder = repo + '-main'

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
    `https://codeload.github.com/jameslovallo/${repo}/zip/refs/heads/main`,
    function (response) {
      response.pipe(file)
      file.on('finish', function () {
        file.close(async function () {
          try {
            await extract(zip, { dir: path.resolve('./') })
            deleteFile(zip)
            fs.cp(folder, './', { recursive: true }, function (err) {
              err && console.log(err)
              deleteFolder(folder)
              if (!starter) {
                deleteFile('./bin.js')
                deleteFile('.gitignore')
                fs.writeFile('./package.json', pkg, function (err) {
                  err && console.error(err)
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
  .on('error', function (err) {
    rm(zip)
  })
