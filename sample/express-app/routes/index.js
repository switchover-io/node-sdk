var express = require('express');
var router = express.Router();


var switchover = require('../../../dist');

const SKD_KEY = 'fb6c850f-7934-4645-a295-ab507857b01f'

const client = switchover.createClient(SKD_KEY, null, 'debug');


/* GET home page. */
router.get('/', async function(req, res, next) {

  await client.refreshAsync();
  const betaFeature = client.toggleValue('beta-feature', false);

  res.render('index', { sdkKey: SKD_KEY, feature: betaFeature } );
});

module.exports = router;
