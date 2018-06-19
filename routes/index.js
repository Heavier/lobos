var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');

/* GET home page. */
router.get('/', function(req, res, next) {
    res.clearCookie("name");
    res.clearCookie("room");
    res.render('index', {
        title: 'Orion'
    });
});

// FORM LOGIN
// router.use(express.json());
router.use(bodyParser.urlencoded({
    extended: true
}));

router.post('/game', function(req, res) {
    var name = req.body.name,
        room = req.body.room;

    var ok = false;
    // Validate name and room
    ok = true;
    if (ok) {
        res.cookie('name', name);
        res.cookie('room', room);
        res.redirect('/game');
    }
});


module.exports = router;
