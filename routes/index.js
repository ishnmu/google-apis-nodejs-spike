var express = require('express');
const { google } = require('googleapis');
const { oauth2 } = require('googleapis/build/src/apis/oauth2');
var router = express.Router();

const oauth2Client = new google.auth.OAuth2(
  process.env?.GOOGLE_CLIENT_ID,
  process.env?.GOOGLE_CLIENT_SECRET,
  process.env?.POST_CONSENT_REDIRECT_URL,
);

const scopes = [
  'https://www.googleapis.com/auth/userinfo.email',
  'https://www.googleapis.com/auth/userinfo.profile'
];

const url = oauth2Client.generateAuthUrl({
  // 'online' (default) or 'offline' (gets refresh_token)
  access_type: 'offline',

  // If you only need one scope you can pass it as a string
  scope: scopes
});
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/google/login', function (req, res) {
  res.redirect(url);
})

router.get('/callback/auth', async function (req, res) {
  const { code } = req.query;
  const { tokens } = await oauth2Client.getToken(code)
  let auth = new google.auth.OAuth2();    // create new auth client
  auth.setCredentials({access_token: tokens.access_token});    // use the new auth client with the access_token
  let oauth2 = google.oauth2({
    auth,
    version: 'v2'
  });
  let { data } = await oauth2.userinfo.get();    // get user info

  res.send({
    data,
  });
});



module.exports = router;
