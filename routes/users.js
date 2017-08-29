var express = require('express');
var router = express.Router();
var knex = require('../db/knex.js');
var bcrypt = require('bcrypt');
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

// create new user
router.get('/add', function(req, res, next) {
  res.render('newUser')
})

// edit page
router.get('/:id/edit', function(req,res, next){
  knex.raw(`SELECT * FROM users WHERE id = ${req.params.id}`)
    .then(function(user) {
      res.render('editUser', {user: user.rows[0]})
    });
})

// show user page
router.get('/:id', function(req, res, next){
  knex.raw(`SELECT users.*, pets.id as pet_id, pets.pet_name, pets.species, pets.pic_url FROM users JOIN pets ON users.id = pets.owner_id WHERE users.id = ${req.params.id}`)
  .then(function(data){
    knex.raw(`SELECT user_reviews.*, users.username FROM user_reviews JOIN users ON users.id = user_reviews.poster_id WHERE user_id = ${req.params.id}`)
      .then(function(reviews) {
        res.render('dashboard', {user_info: data.rows, reviews: reviews.rows, cookie: req.cookies.user_id})
      })
  })
})

// create user
router.post('/add', function(req, res, next) {
  if (req.body.password === req.body.verify) {
    bcrypt.hash(req.body.password, 8, function(err, hash) {
      knex.raw(`INSERT INTO users VALUES (default, '${req.body.username}', '${hash}', '${req.body.location}', '${req.body.bio}', '${req.body.email}', '${req.body.phone}', '${req.body.info}')`)
        .then(function(data) {
          res.redirect('/')
        })
    })
  } else {
    res.redirect('/')
  }
})

router.post('/:id', function(req, res, next) {
  knex.raw(`UPDATE users SET (username, location, bio, email, phone_number, house_info) = ('${req.body.username}', '${req.body.location}', '${req.body.bio}', '${req.body.email}', '${req.body.phone_number}', '${req.body.info}') WHERE id = ${req.params.id}`)
    .then(function(user) {
      res.redirect(`/users/${req.params.id}`)
    })
})






module.exports = router;
