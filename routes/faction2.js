var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) { 
  res.render('faction2', { title : 'Faction 2' });
});

module.exports = router;
