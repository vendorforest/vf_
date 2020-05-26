//get user ip
import publicIp from "public-ip";

export default function(app) {
  let ip_location;
  // This middleware will check if user's cookie is still saved in
  //browser and user is not set, then automatically log the user out.
  // This usually happens when you stop your express server after login,
  //your cookie still remains saved in the browser.

  app.use(async (req, res, next) => {
    const ip_v4 = await publicIp.v4();
    const ip_v6 = await publicIp.v6();
    const DEBUG = false;
    const http = require("http"); //to use https need to upgrade

    // console.log(ip_v4);
    //=> '46.5.21.123'

    // console.log(ip_v6);
    //=> 'fe80::200:f8ff:fe21:67cf'

    if (DEBUG) {
      require("isomorphic-fetch")(async () => {
        http.get(
          `https://api.ipstack.com/${ip_v4}?access_key=81f1dc79ef5bb8c315467ae4bba4a68c`,
          function(resp) {
            var body = "";
            resp.on("data", function(data) {
              body += data;
            });

            resp.on("end", function() {
              ip_location = JSON.parse(body);
            });
          },
        );
      })();
    }

    DEBUG && console.log(ip_location);
    ///if (req.cookies.user_sid && !req.session.user) {
    //    res.clearCookie('user_sid');
    //}
    next();
  });
}
