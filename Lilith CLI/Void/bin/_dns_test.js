const dns = require('dns');
dns.resolve4('api.remote-browser.dev', (err, ips) => {
  console.log('api.remote-browser.dev:', ips || (err && err.message));
  dns.resolve4('remote-browser.dev', (err2, ips2) => {
    console.log('remote-browser.dev:', ips2 || (err2 && err2.message));
  });
});
