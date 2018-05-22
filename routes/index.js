var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
// const { check, validationResult } = require('express-validator/check');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Lobos' });
});

// FORM LOGIN
// router.use(express.json());
router.use(bodyParser.urlencoded({ extended: true }));

router.post('/game', function(req, res){
    var name = req.body.name,
        room = req.body.room;
    return res.send(name + " on " + room);
    // User.create({
    //     username: req.body.name,
    //     room: req.body.room
    // }).then(user => res.json(user));
});


module.exports = router;
