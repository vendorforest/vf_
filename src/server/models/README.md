/**
 * 
 *  email({
                        type: 'welcome',
                        email: this.email,
                })
                .then(() => {
                        next();
                })
                .catch(err => {
                        logger.error(err);
                        next();
                });
                
  email({
                        type: 'password',
                        email: this._conditions.email,
                        passcode: this._update.recoveryCode,
                })
                .then(() => {
                        next();
                })
                .catch(err => {
                        logger.error(err);
                        next();
                });

 */

        /*bcrypt.hash(user.password, 10, function (err, hash) {
                if (err) {
                        return next(err);
                }
                user.password = hash;
                next();
        });*/


  (async () => {
    const DEBUG = true;
    const http = require('http'); //https need to upgrade
    const ip_v4 = await publicIp.v4();
    const ip_v6 = await publicIp.v6();

    env.MODE === "development" && console.log(ip_v4);
    //=> '46.5.21.123'

    env.MODE === "development" && console.log(ip_v6);
    //=> 'fe80::200:f8ff:fe21:67cf'
    if (DEBUG) {
      http.get(`http://api.ipstack.com/${ip_v4}?access_key=81f1dc79ef5bb8c315467ae4bba4a68c`, function (resp) {
        var body = ''
        resp.on('data', function (data) {
          body += data;
        });

        resp.on('end', function () {
          req.ip_location = JSON.parse(body);
        });
      });
    }
  })();