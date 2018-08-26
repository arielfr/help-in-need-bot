const FB = require('fb');

FB.api('oauth/access_token', {
  client_id: '2174080466163074',
  client_secret: '',
  grant_type: 'fb_exchange_token',
  fb_exchange_token: ''
}, res => {
  if(!res || res.error) {
    console.log(!res ? 'error occurred' : res.error);
    return;
  }

  const accessToken = res.access_token;
  const expires = res.expires ? res.expires : 0;

  console.log(accessToken);
  console.log(expires);
});
