const express = require('express');
const router = express.Router();
const config = require('../data/config.json');

router.get('/', function(req, res) {
  res.render('index', {
    title: config.page_title,
    team: config.teams
  });
});

router.get('/login', (req, res) => {
  res.render('login');
});

router.post('/login', (req, res) => {
  if (req.body.password === config.host_password) {
    req.session.hostLoggedIn = true;
    res.redirect('/host');
  } else {
    res.render('login', {
      error: 'Incorrect password'
    });
  }
});

module.exports = router;
