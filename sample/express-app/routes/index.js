var express = require('express');
var router = express.Router();


var switchover = require('../../../dist');

const SKD_KEY = '<SDK-KEY>'

const client = switchover.createClient(SKD_KEY, {
  ttl: 10 /* hold cache 10 seconds */
}, 'debug');


/* GET home page. */
router.get('/', async function(req, res, next) {

  await client.fetchAsync(); // use refreshAsync() if you always want a fresh "copy" from server without ttl
  const betaFeature = client.toggleValue('<TOGGLE-NAME>', false);

  res.render('index', { sdkKey: SKD_KEY, feature: betaFeature } );
});

module.exports = router;
