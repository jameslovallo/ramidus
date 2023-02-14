#! /usr/bin/env node
import extract from 'extract-zip'
import fs, { readdir } from 'fs'
import https from 'https'
import path from 'path'

const zip = './ramidus.zip'

const rm = (path) =>
  fs.unlink(path, function (err) {
    err && console.log(err)
  })

const file = fs.createWriteStream(zip)

https
  .get(
    'https://codeload.github.com/jameslovallo/Custom-Element-SPA/zip/refs/heads/main',
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
                  rm('./bin.js')
                  rm('./package.json')
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
