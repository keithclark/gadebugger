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
    },
    'User Timings': {
        'with category, var and value': function (test) {
            var beacon = new UtmBeacon('http://www.google-analytics.com/__utm.gif?utmwv=5.6.7&utms=13&utmn=617760573&utmhn=10.0.0.8&utmt=event&utme=14(90!Var*Category*1230)(90!1234)&utmcs=UTF-8&utmsr=1440x900&utmvp=1438x474&utmsc=24-bit&utmul=en-us&utmje=1&utmfl=19.0%20r0&utmdt=Google%20Analytics%20Test%20Page&utmhid=2131029259&utmr=0&utmp=%2F&utmht=1444206336631&utmac=UA-AAAA-B&utmcc=__utma%3D196898604.1628777192.1444173499.1444173499.1444206337.2%3B%2B__utmz%3D196898604.1444173499.1.1.utmcsr%3D(direct)%7Cutmccn%3D(direct)%7Cutmcmd%3D(none)%3B&utmjid=&utmu=6ACLAAAAAAAAAAAAAEAAQAAE~');
            test.strictEqual(beacon.type, 'timing');
            test.strictEqual(beacon.userTimings.category, 'Category');
            test.strictEqual(beacon.userTimings.variable, 'Var');
            test.strictEqual(beacon.userTimings.value, 1234);
            test.strictEqual(beacon.userTimings.label, undefined);
            test.done();
        },
        'with category, var, value and label': function (test) {
            var beacon = new UtmBeacon('http://www.google-analytics.com/__utm.gif?utmwv=5.6.7&utms=14&utmn=1078482289&utmhn=10.0.0.8&utmt=event&utme=14(90!Var*Category*1230*Label)(90!1234)&utmcs=UTF-8&utmsr=1440x900&utmvp=1438x474&utmsc=24-bit&utmul=en-us&utmje=1&utmfl=19.0%20r0&utmdt=Google%20Analytics%20Test%20Page&utmhid=2131029259&utmr=0&utmp=%2F&utmht=1444206336638&utmac=UA-AAAA-B&utmcc=__utma%3D196898604.1628777192.1444173499.1444173499.1444206337.2%3B%2B__utmz%3D196898604.1444173499.1.1.utmcsr%3D(direct)%7Cutmccn%3D(direct)%7Cutmcmd%3D(none)%3B&utmjid=&utmu=6ACLAAAAAAAAAAAAAEAAQAAE~');
            test.strictEqual(beacon.type, 'timing');
            test.strictEqual(beacon.userTimings.category, 'Category');
            test.strictEqual(beacon.userTimings.variable, 'Var');
            test.strictEqual(beacon.userTimings.value, 1234);
            test.strictEqual(beacon.userTimings.label, 'Label');
            test.done();
        }
    },
    'Custom Vars': {
        'using concurrent slots': function (test) {
            var beacon = new UtmBeacon('http://www.google-analytics.com/__utm.gif?utmwv=5.6.7&utms=15&utmn=1494307825&utmhn=10.0.0.8&utme=8(Name%201*Name%202*Name%203*Name%204*Name%205)9(Value%201*Value%202*Value%203*Value%204*Value%205)11(1*2*4!1*2)&utmcs=UTF-8&utmsr=1440x900&utmvp=1438x474&utmsc=24-bit&utmul=en-us&utmje=1&utmfl=19.0%20r0&utmdt=Google%20Analytics%20Test%20Page&utmhid=2131029259&utmr=0&utmp=%2Fcustom-var-test&utmht=1444206336663&utmac=UA-AAAA-B&utmcc=__utma%3D196898604.1628777192.1444173499.1444173499.1444206337.2%3B%2B__utmz%3D196898604.1444173499.1.1.utmcsr%3D(direct)%7Cutmccn%3D(direct)%7Cutmcmd%3D(none)%3B&utmjid=&utmu=6QCLAAAAAAAAAAAAAEAAQAAE~');
            test.strictEqual(beacon.customVars.length, 5);
            test.deepEqual(beacon.customVars[0], {slot: 1, key: 'Name 1', value: 'Value 1', scope: 1});
            test.deepEqual(beacon.customVars[1], {slot: 2, key: 'Name 2', value: 'Value 2', scope: 2});
            test.deepEqual(beacon.customVars[2], {slot: 3, key: 'Name 3', value: 'Value 3', scope: 3});
            test.deepEqual(beacon.customVars[3], {slot: 4, key: 'Name 4', value: 'Value 4', scope: 1});
            test.deepEqual(beacon.customVars[4], {slot: 5, key: 'Name 5', value: 'Value 5', scope: 2});
            test.done();
        },
        'not using concurrent slots': function (test) {
            var beacon = new UtmBeacon('http://www.google-analytics.com/__utm.gif?utmwv=5.6.7&utms=16&utmn=2096985664&utmhn=10.0.0.8&utme=8(Name%201*3!Name%203*5!Name%205)9(Value%201*3!Value%203*5!Value%205)11(1*5!2)&utmcs=UTF-8&utmsr=1440x900&utmvp=1438x474&utmsc=24-bit&utmul=en-us&utmje=1&utmfl=19.0%20r0&utmdt=Google%20Analytics%20Test%20Page&utmhid=2131029259&utmr=0&utmp=%2Fcustom-var-test-2&utmht=1444206336696&utmac=UA-AAAA-B&utmcc=__utma%3D196898604.1628777192.1444173499.1444173499.1444206337.2%3B%2B__utmz%3D196898604.1444173499.1.1.utmcsr%3D(direct)%7Cutmccn%3D(direct)%7Cutmcmd%3D(none)%3B&utmjid=&utmu=6QCLAgAAAAAAAAAAAEAAQAAE~');
            test.strictEqual(beacon.customVars.length, 3);
            test.deepEqual(beacon.customVars[0], {slot: 1, key: 'Name 1', value: 'Value 1', scope: 1});
            test.deepEqual(beacon.customVars[1], {slot: 3, key: 'Name 3', value: 'Value 3', scope: 3});
            test.deepEqual(beacon.customVars[2], {slot: 5, key: 'Name 5', value: 'Value 5', scope: 2});
            test.done();
        }
    },
    'Social': function (test) {
        var beacon = new UtmBeacon('http://www.google-analytics.com/__utm.gif?utmt=social&utmsn=network&utmsa=action&utmsid=target');
        test.strictEqual(beacon.type, 'social');
        test.strictEqual(beacon.social.network, 'network');
        test.strictEqual(beacon.social.action, 'action');
        test.strictEqual(beacon.social.target, 'target');
        test.done();
    },
    'Transaction': {
        'transaction': function (test) {
            var beacon = new UtmBeacon('http://www.google-analytics.com/__utm.gif?utmwv=5.6.7&utms=11&utmn=747978421&utmhn=10.0.0.8&utmt=tran&utmtid=1234&utmtst=affiliation&utmtto=12.34&utmttx=8.90&utmtsp=5.67&utmtci=city&utmtrg=state&utmtco=country&utmcs=UTF-8&utmsr=1440x900&utmvp=1438x474&utmsc=24-bit&utmul=en-us&utmje=1&utmfl=19.0%20r0&utmdt=Google%20Analytics%20Test%20Page&utmhid=2131029259&utmr=0&utmp=%2F&utmht=1444206336623&utmac=UA-AAAA-B&utmcc=__utma%3D196898604.1628777192.1444173499.1444173499.1444206337.2%3B%2B__utmz%3D196898604.1444173499.1.1.utmcsr%3D(direct)%7Cutmccn%3D(direct)%7Cutmcmd%3D(none)%3B&utmjid=&utmu=6ACLAAAAAAAAAAAAAEAAAAAE~');
            test.strictEqual(beacon.type, 'transaction');
            test.strictEqual(beacon.transaction.id, 1234);
            test.strictEqual(beacon.transaction.affiliation, 'affiliation');
            test.strictEqual(beacon.transaction.revenue, 12.34);
            test.strictEqual(beacon.transaction.shipping, 5.67);
            test.strictEqual(beacon.transaction.tax, 8.90);
            test.done();
        },
        'item': function (test) {
            var beacon = new UtmBeacon('http://www.google-analytics.com/__utm.gif?utmwv=5.6.7&utms=12&utmn=124848449&utmhn=10.0.0.8&utmt=item&utmtid=1234&utmipc=sku&utmipn=name&utmiva=category&utmipr=12.34&utmiqt=1&utmcs=UTF-8&utmsr=1440x900&utmvp=1438x474&utmsc=24-bit&utmul=en-us&utmje=1&utmfl=19.0%20r0&utmdt=Google%20Analytics%20Test%20Page&utmhid=2131029259&utmr=0&utmp=%2F&utmht=1444206336624&utmac=UA-AAAA-B&utmcc=__utma%3D196898604.1628777192.1444173499.1444173499.1444206337.2%3B%2B__utmz%3D196898604.1444173499.1.1.utmcsr%3D(direct)%7Cutmccn%3D(direct)%7Cutmcmd%3D(none)%3B&utmjid=&utmu=6ACLAAAAAAAAAAAAAEAAAAAE~');
            test.strictEqual(beacon.type, 'item');
            test.strictEqual(beacon.transactionItem.transactionId, 1234);
            test.strictEqual(beacon.transactionItem.name, 'name');
            test.strictEqual(beacon.transactionItem.sku, 'sku');
            test.strictEqual(beacon.transactionItem.category, 'category');
            test.strictEqual(beacon.transactionItem.price, 12.34);
            test.strictEqual(beacon.transactionItem.quantity, 1);
            test.done();
        }
    }
}