import request from 'superagent'
import { green, red, blue, yellow } from 'colors'

let bts = {}

let stdin = process.stdin

readContent()

function requestSearch(content) {
  content = content.trim()
  request
    .get('http://54.215.144.41:3000/async/search')
    .query({ content })
    .end((err, res) => {
      if (err) return console.error(err)
      let { total, results } = res.body
      if (total == 0) {
        console.log(red(`未搜索到与 ${content} 相关的资源！`))
        readContent()
        return
      }
      lineBreak()
      results.forEach((bt, index) => {
        const { _id, name, hot } = bt
        bts[_id] = bt
        console.log(green(`${index+1}. ${name} `), blue(`[${hot}]`))
      })
      readChoice(results)
    })
}

function write(str) { process.stdout.write(str) }

function writeLine() { console.log.apply(null, arguments) }

function lineBreak() { console.log('') }

function readContent() {
  write('Enter search content: ')
  stdin.resume()
  stdin.setEncoding('utf-8')
  stdin.once('data', content => {
    content = content.trim()
    if (content.toLocaleLowerCase() === 'exit') {
      lineBreak()
      return stdin.pause()
    }
    requestSearch(content)
  })
}

function readChoice(results) {
  let handleEvent = index => {
    index = index.trim()
    if (Number(index) && results[index-1]) {
      lineBreak()
      writeLine(yellow(`Magnet Url: ${results[index-1].magnet}`))
      stdin.removeListener('data', handleEvent)
      lineBreak()
      readContent()
    } else if (index.toLocaleLowerCase() === 'exit') {
      lineBreak()
      stdin.pause()
    } else {
      write(red('Enter your choice: '))
    }
  }
  lineBreak()
  write(blue('Enter your choice: '))
  stdin.resume()
  stdin.setEncoding('utf-8')
  stdin.on('data', handleEvent)
}
