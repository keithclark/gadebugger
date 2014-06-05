var fs = require('fs');

eval(fs.readFileSync('src/core/utils.js').toString());
eval(fs.readFileSync('src/core/utmBeacon.js').toString());

module.exports = {
    setUp: function (callback) {
        this.beacon = new UtmBeacon("http://www.google-analytics.com/__utm.gif?utmwv=5.4.9&utms=2&utmn=1799917456&utmhn=keithclark.co.uk&utmcs=UTF-8&utmsr=2560x1440&utmvp=1771x681&utmsc=24-bit&utmul=en-us&utmje=1&utmfl=12.0%20r0&utmdt=Keith%20Clark%20%7C%20Google%20Analytics%20Debugger%20test%20page&utmhid=993411335&utmr=-&utmp=%2F&utmht=1396974107120&utmac=UA-12345678-9&utmcc=__utma%3D245048406.767435740.1340726838.1396622387.1396974103.240%3B%2B__utmz%3D245048406.1395741622.236.74.utmcsr%3Dt.co%7Cutmccn%3D(referral)%7Cutmcmd%3Dreferral%7Cutmcct%3D%2Fgd2Df7cac6%3B&utmu=q~");
        callback();
    },
    'Account Info': function(test) {
        test.equal(this.beacon.account, "UA-12345678-9");
        test.done();
    },
    'Tracker Info': function(test) {
        test.strictEqual(this.beacon.version, "5.4.9");
        test.equal(this.beacon.trackingMethod, "Traditional Analytics");
        test.done();
    },
    'Client Info': function(test) {
        test.equal(this.beacon.flashVersion, "12.0 r0");
        test.strictEqual(this.beacon.javaEnabled, true);
        test.strictEqual(this.beacon.screen.width, 2560, "Screen width");
        test.strictEqual(this.beacon.screen.height, 1440, "Screen height");
        test.strictEqual(this.beacon.viewport.width, 1771, "Viewport width");
        test.strictEqual(this.beacon.viewport.height, 681, "Viewport height");
        test.done();
    },
    'Document Info': function(test) {
        test.strictEqual(this.beacon.charset, "UTF-8");
        test.strictEqual(this.beacon.language, "en-us");
        test.strictEqual(this.beacon.referrer, "-");
        test.strictEqual(this.beacon.documentHostname, "keithclark.co.uk");
        test.done();
    },
    'Page Tracking': function(test) {
        test.strictEqual(this.beacon.type, "pageview");
        test.strictEqual(this.beacon.documentTitle, "Keith Clark | Google Analytics Debugger test page");
        test.strictEqual(this.beacon.documentUrl, "http://keithclark.co.uk/");
        test.strictEqual(this.beacon.documentPath, "/");
        test.done();
    },
    'Content Groups': function(test) {
        var beacon = new UtmBeacon("http://www.google-analytics.com/__utm.gif?utmwv=5.5.0&utms=61&utmn=2086913598&utmhn=my.website.com&utmcs=UTF-8&utmsr=2560x1440&utmvp=1530x954&utmsc=24-bit&utmul=en-us&utmje=1&utmfl=13.0%20r0&utmdt=Google%20Analytics%20Test%20Page&utmhid=245723988&utmr=-&utmp=%2Fcontent-group-test&utmpg=1:Content%20Group%201,2:Content%20Group%202,3:Content%20Group%203,4:Content%20Group%204,5:Content%20Group%205&utmht=1399388917053&utmac=UA-AAAA-B&utmcc=__utma%3D37135225.316661751.1389271081.1399381608.1399386143.16%3B%2B__utmz%3D37135225.1389271081.1.1.utmcsr%3D(direct)%7Cutmccn%3D(direct)%7Cutmcmd%3D(none)%3B&utmu=6ACLAAAAAAAAAAAAAEAAAB~");
        test.strictEqual(beacon.contentGroups[1], "Content Group 1");
        test.strictEqual(beacon.contentGroups[2], "Content Group 2");
        test.strictEqual(beacon.contentGroups[3], "Content Group 3");
        test.strictEqual(beacon.contentGroups[4], "Content Group 4");
        test.strictEqual(beacon.contentGroups[5], "Content Group 5");
        test.done();
    }
}