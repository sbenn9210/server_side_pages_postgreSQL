const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const mustacheExpress = require('mustache-express')
const promise = require('bluebird')

//telling pg-promise that we will be using bluebird as the promise library
let options = {
  promiseLib : promise
}

//linking the database to pg promise
let pgp = require('pg-promise')(options)
let connectionString = 'postgres://localhost:5432/groceries'
let db = pgp(connectionString)


// create application/json parser
var jsonParser = bodyParser.json()

//setting up the body parser to use URL encoded
app.use(bodyParser.urlencoded({ extended: false}))


//setting the templating engine to use mustacheExpress
app.engine('mustache', mustacheExpress())
//setting the mustache pages directory
app.set('views', './views')
//set the view engine to mustache
app.set('view engine', 'mustache')

//load the index mustache page
app.get('/groceries', function(req, res) {
  db.any('SELECT itemName, quantity FROM shoppingItems').then(function(data) {
    console.log(data)
    res.render('groceries', {list: data})
  })
})



app.post('/groceries', function(req, res) {
  let store = req.body.store
  let item = req.body.item
  let quantity = req.body.quantity


  db.one('INSERT INTO stores(name) VALUES($1) RETURNING storeid', [store]).then(function(data) {


  db.none('INSERT INTO shoppingItems(itemName, quantity, storeId) values($1, $2, $3)', [item, quantity, data.storeid]).then(function() {

    res.redirect('/groceries')

  })
  })

})


















app.listen(3000, () => console.log('THE SERVER IS ALIVE!!!'))
