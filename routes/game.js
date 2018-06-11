var express = require('express');
var router = express.Router();


/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('game', { title: 'Lobos · Por Javier Martín F.' });
});

module.exports = router;
