var express = require('express');
var router = express.Router();


/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('game', { title: 'Lobos · Playing' });
});

module.exports = router;
