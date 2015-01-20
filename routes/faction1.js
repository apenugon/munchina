var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) { 
  res.render('faction1', { title : 'Faction 1' });
});

module.exports = router;
