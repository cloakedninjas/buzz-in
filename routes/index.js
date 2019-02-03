const express = require('express');
const router = express.Router();
const config = require('../data/config.json');

router.get('/', function(req, res) {
  res.render('index', { title: 'Express' });
});

router.get('/login', (req, res) => {
  res.render('login');
});

router.post('/login', (req, res) => {
  if (req.body.password === config['admin-password']) {
    app.initSession(req, res);
    res.redirect('/admin');
    next();
  } else {
    res.render('login', {
      error: 'Incorrect password'
    });
  }
});

module.exports = router;
