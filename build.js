const fs = require('fs')
const path = require('path')
const {minify} = require('terser')

const PRE = 'javascript:'
const POST = 'void(0)'

const SRC_FILE = './index.js'
const BUILD_DIR = './build/'

fs.readFile(SRC_FILE, 'utf-8', (err, data) => {
  if (err) {
    return console.log(err)
  }

  const sourceCode = data
  minify(sourceCode, {mangle: false})
    .then(data => {
      let minifiedCode = data.code
      const fixCodeFragment = 'minutes%60'
      minifiedCode = minifiedCode.replace(fixCodeFragment, encodeURI(fixCodeFragment))
      const result = PRE + minifiedCode + POST

      console.log(path.resolve(BUILD_DIR, SRC_FILE))
      fs.writeFileSync(path.resolve(BUILD_DIR, SRC_FILE), result, 'utf-8')
    })
})
