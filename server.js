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

  // console.log(newWebsite)
  // console.log(req.params.website)
  let website = req.params.website
  let isValid = Boolean(pattern.test(website))

  if (isValid) {
    mongoose.connect(mongoDB, (err, db) => {
      if (err) { return err }
      // db.collection('websites').insert({
      //   'old': website,
      //   'new': newWebsite
      // })

      db.collection('websites').findOne({'old': website}, (err, item) => {
        if (err) {
          console.log(err)
          // return err
        }
        if (item) {
          console.log('item: ', item)
          // item.forEach((item) => {
          //   res.send(JSON.stringify(item))
          //   console.log(item)
          // })
        } else { // if doesnt exist add it to database
          console.log('item doesnt exist')
        }
      })

      db.close()
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

  // console.log(typeof (shortURL))
  if (isNumber) {
    mongoose.connect(mongoDB, (err, db) => {
      if (err) {
        console.log(err)
        return err
      }
      db.collection('websites').findOne({'new': shortURL}, (err, item) => {
        if (err) {
          console.log(err)
          return err
        }
        if (item) {
          let redirectURL = item.old
          res.redirect(`http://${redirectURL}`)
        } else {
          console.log('item doesnt exist')
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

// app.get('/new/:website', (req, res) => {
//
//     let userInput = req.params.website;

//     let isValid = Boolean(pattern.test(userInput));
//     console.log(isValid);
//     if (isValid) {
//         mongo.connect(url, (err, db) => {
//             if (err) throw err;
//             const docs = db.db('heroku_prtr1p3x').collection('urls');
//             console.log('docs: ', docs);
//             // docs.getAll().then(data => {
//             //     console.log('New age: 40');
//             // }).catch(console.log());

//             db.close();
//         });

//     } else {
//         res.send(JSON.stringify({
//             "error": "This url is not on the database."
//         }));
//     }
// });

app.listen(port, console.log(`Listening on port ${port}`))
