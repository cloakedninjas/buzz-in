const express = require('express');
const router = express.Router();

router.use(verifyAccess);

router.get('/', function(req, res) {
  res.render('host', { title: 'Express' });
});

function verifyAccess (req, res, next) {
  if (req.connection.localAddress === req.connection.remoteAddress) {
    next();
    return;
  }

  if (req.session.hostLoggedIn && req.url === '/login') {
    // user logged in trying to access login page
    res.redirect('/host');
  } else if (!req.session.hostLoggedIn && req.url !== '/login') {
    res.status(401);
    res.render('login');
  } else {
    next();
  }
}

module.exports = router;
