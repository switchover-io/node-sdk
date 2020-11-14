var express = require('express');
var router = express.Router();


var switchover = require('../../../dist');

const SKD_KEY = '<SDK-KEY>'

const client = switchover.createClient(SKD_KEY, null, 'debug');


/* GET home page. */
router.get('/', async function(req, res, next) {

  await client.refreshAsync();
  const betaFeature = client.toggleValue('<TOGGLE-NAME>', false);

  res.render('index', { sdkKey: SKD_KEY, feature: betaFeature } );
});

module.exports = router;
