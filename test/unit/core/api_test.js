var fs = require('fs');

eval(fs.readFileSync('src/core/api.js').toString());
eval(fs.readFileSync('src/core/utils.js').toString());
eval(fs.readFileSync('src/core/uaBeacon.js').toString());
eval(fs.readFileSync('src/core/utmBeacon.js').toString());

module.exports = {
    "API.parseBeacon": {
        'Universal analytics over HTTP': function (test) {
            var beacon = GACoreAPI.parseBeacon("http://www.google-analytics.com/collect?v=1&_v=j18&a=218456248&t=pageview&_s=1&dl=http%3A%2F%2Fmy.website.com%2Fgadebugger%2Findex.html&ul=en-us&de=UTF-8&dt=Google%20Analytics%20Test%20Page&sd=24-bit&sr=2560x1440&vp=1478x75&je=1&fl=12.0%20r0&_u=MACAAE~&cid=1676952207.1396992088&tid=UA-XXXX-Y&z=1676558952");
            test.strictEqual(beacon instanceof UaBeacon, true);
            test.done();
        },
        'Universal analytics over HTTPS': function (test) {
            var beacon = GACoreAPI.parseBeacon("https://www.google-analytics.com/collect?v=1&_v=j18&a=218456248&t=pageview&_s=1&dl=http%3A%2F%2Fmy.website.com%2Fgadebugger%2Findex.html&ul=en-us&de=UTF-8&dt=Google%20Analytics%20Test%20Page&sd=24-bit&sr=2560x1440&vp=1478x75&je=1&fl=12.0%20r0&_u=MACAAE~&cid=1676952207.1396992088&tid=UA-XXXX-Y&z=1676558952");
            test.strictEqual(beacon instanceof UaBeacon, true);
            test.done();
        },
        'Traditional analytics over HTTP': function (test) {
            var beacon = GACoreAPI.parseBeacon("http://www.google-analytics.com/__utm.gif?utmwv=5.4.9&utms=2&utmn=1799917456&utmhn=keithclark.co.uk&utmcs=UTF-8&utmsr=2560x1440&utmvp=1771x681&utmsc=24-bit&utmul=en-us&utmje=1&utmfl=12.0%20r0&utmdt=Keith%20Clark%20%7C%20Google%20Analytics%20Debugger%20test%20page&utmhid=993411335&utmr=-&utmp=%2F&utmht=1396974107120&utmac=UA-12345678-9&utmcc=__utma%3D245048406.767435740.1340726838.1396622387.1396974103.240%3B%2B__utmz%3D245048406.1395741622.236.74.utmcsr%3Dt.co%7Cutmccn%3D(referral)%7Cutmcmd%3Dreferral%7Cutmcct%3D%2Fgd2Df7cac6%3B&utmu=q~");
            test.strictEqual(beacon instanceof UtmBeacon, true);
            test.done();
        },
        'Traditional analytics over HTTPS': function (test) {
            var beacon = GACoreAPI.parseBeacon("https://ssl.google-analytics.com/__utm.gif?utmwv=5.4.9&utms=2&utmn=1799917456&utmhn=keithclark.co.uk&utmcs=UTF-8&utmsr=2560x1440&utmvp=1771x681&utmsc=24-bit&utmul=en-us&utmje=1&utmfl=12.0%20r0&utmdt=Keith%20Clark%20%7C%20Google%20Analytics%20Debugger%20test%20page&utmhid=993411335&utmr=-&utmp=%2F&utmht=1396974107120&utmac=UA-12345678-9&utmcc=__utma%3D245048406.767435740.1340726838.1396622387.1396974103.240%3B%2B__utmz%3D245048406.1395741622.236.74.utmcsr%3Dt.co%7Cutmccn%3D(referral)%7Cutmcmd%3Dreferral%7Cutmcct%3D%2Fgd2Df7cac6%3B&utmu=q~");
            test.strictEqual(beacon instanceof UtmBeacon, true);
            test.done();
        },
        'Traditional analytics remarketing over HTTP': function (test) {
            var beacon = GACoreAPI.parseBeacon("http://stats.g.doubleclick.net/__utm.gif?utmwv=5.4.9&utms=2&utmn=1799917456&utmhn=keithclark.co.uk&utmcs=UTF-8&utmsr=2560x1440&utmvp=1771x681&utmsc=24-bit&utmul=en-us&utmje=1&utmfl=12.0%20r0&utmdt=Keith%20Clark%20%7C%20Google%20Analytics%20Debugger%20test%20page&utmhid=993411335&utmr=-&utmp=%2F&utmht=1396974107120&utmac=UA-12345678-9&utmcc=__utma%3D245048406.767435740.1340726838.1396622387.1396974103.240%3B%2B__utmz%3D245048406.1395741622.236.74.utmcsr%3Dt.co%7Cutmccn%3D(referral)%7Cutmcmd%3Dreferral%7Cutmcct%3D%2Fgd2Df7cac6%3B&utmu=q~");
            test.strictEqual(beacon instanceof UtmBeacon, true);
            test.done();
        },
        'Traditional analytics remarketing over HTTPS': function (test) {
            var beacon = GACoreAPI.parseBeacon("https://stats.g.doubleclick.net/__utm.gif?utmwv=5.4.9&utms=2&utmn=1799917456&utmhn=keithclark.co.uk&utmcs=UTF-8&utmsr=2560x1440&utmvp=1771x681&utmsc=24-bit&utmul=en-us&utmje=1&utmfl=12.0%20r0&utmdt=Keith%20Clark%20%7C%20Google%20Analytics%20Debugger%20test%20page&utmhid=993411335&utmr=-&utmp=%2F&utmht=1396974107120&utmac=UA-12345678-9&utmcc=__utma%3D245048406.767435740.1340726838.1396622387.1396974103.240%3B%2B__utmz%3D245048406.1395741622.236.74.utmcsr%3Dt.co%7Cutmccn%3D(referral)%7Cutmcmd%3Dreferral%7Cutmcct%3D%2Fgd2Df7cac6%3B&utmu=q~");
            test.strictEqual(beacon instanceof UtmBeacon, true);
            test.done();
        },
        'Unknown Url': function (test) {
            var beacon = GACoreAPI.parseBeacon("http://my.website.com");
            test.strictEqual(beacon, undefined);
            test.done();
        },
    },
    'API.isBeaconUrl': {
        'Universal analytics URL': function (test) {
            test.strictEqual(GACoreAPI.isBeaconUrl('http://www.google-analytics.com/collect'), true);
            test.strictEqual(GACoreAPI.isBeaconUrl('https://www.google-analytics.com/collect'), true);
            test.done();
        },
        'Traditional analytics URL': function (test) {
            test.strictEqual(GACoreAPI.isBeaconUrl('http://www.google-analytics.com/__utm.gif'), true);
            test.strictEqual(GACoreAPI.isBeaconUrl('https://ssl.google-analytics.com/__utm.gif'), true);
            test.done();
        },
        'Traditional analytics remarketing URL': function (test) {
            test.strictEqual(GACoreAPI.isBeaconUrl('http://stats.g.doubleclick.net/__utm.gif'), true);
            test.strictEqual(GACoreAPI.isBeaconUrl('https://stats.g.doubleclick.net/__utm.gif'), true);
            test.done();
        },
        'Non-GA URL': function (test) {
            test.strictEqual(GACoreAPI.isBeaconUrl('http://my.website.com'), false);
            test.done();
        }
    }
};