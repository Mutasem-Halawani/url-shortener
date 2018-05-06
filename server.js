const express = require('express')
const path = require('path')
var mongoose = require('mongoose')

const port = process.env.PORT || 3000

const app = express()
var mongoDB = 'mongodb://mutasem:mutasem@ds111410.mlab.com:11410/testdb0'

app.use(express.static(path.join(__dirname, 'public')))
app.get('/new/:website', (req, res) => {
  const pattern = /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/gm
  var newWebsite = Math.floor(1000 + Math.random() * 9000)
  let website = req.params.website
  let isValid = Boolean(pattern.test(website))

  if (isValid) {
    mongoose.connect(mongoDB, (err, db) => {
      if (err) { return err }
      db.collection('websites').findOne({'old': website}, (err, item) => {
        if (err) { return err }
        if (item) {
          console.log(typeof (item))
          res.setHeader('Content-Type', 'application/json')
          res.send(JSON.stringify({
            'item exists before': 'true',
            item
          }))
        } else {
          db.collection('websites').insert({
            'old': website,
            'new': newWebsite
          })
          res.setHeader('Content-Type', 'application/json')
          res.send(JSON.stringify({
            'old': website,
            'new': newWebsite
          }))
        }
      })
    })
  } else {
    res.setHeader('Content-Type', 'application/json')
    res.send(JSON.stringify({
      'error': 'This url is invalid'
    }))
  }
})

app.get('/:short', (req, res) => {
  const numberPattern = /^[0-9]*$/
  let shortURL = Number(req.params.short)
  let isNumber = Boolean(numberPattern.test(shortURL))
  if (isNumber) {
    mongoose.connect(mongoDB, (err, db) => {
      if (err) { return err }
      db.collection('websites').findOne({'new': shortURL}, (err, item) => {
        if (err) { return err }
        if (item) {
          let redirectURL = item.old
          res.redirect(`http://${redirectURL}`)
        } else {
          res.setHeader('Content-Type', 'application/json')
          res.send(JSON.stringify({
            'error': 'Item doesn\'t exist'
          }))
        }
      })
    })
  } else {
    res.setHeader('Content-Type', 'application/json')
    res.send(JSON.stringify({
      'error': 'Short Urls consist of numbers only'
    }))
  }
})

app.listen(port, console.log(`Listening on port ${port}`))
