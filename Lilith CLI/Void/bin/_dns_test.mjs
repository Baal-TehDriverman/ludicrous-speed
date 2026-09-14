import { promises as dns } from 'dns';
(async () => {
  try {
    const apiIps = await dns.resolve4('api.remote-browser.dev');
    console.log('api.remote-browser.dev:', apiIps);
  } catch (e) { console.log('api error:', e.message); }
  try {
    const remoteIps = await dns.resolve4('remote-browser.dev');
    console.log('remote-browser.dev:', remoteIps);
  } catch (e) { console.log('remote error:', e.message); }
})();
