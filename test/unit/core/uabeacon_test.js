var fs = require('fs');

eval(fs.readFileSync('src/core/utils.js').toString());
eval(fs.readFileSync('src/core/uaBeacon.js').toString());

module.exports = {
        /* TODO: fix beacon urls */
    "Common": {
        'Account Info': function (test) {
            var beacon = new UaBeacon("http://www.google-analytics.com/collect?v=1&_v=j18&a=218456248&t=pageview&_s=1&dl=http%3A%2F%2Fmy.website.com%2Fgadebugger%2Findex.html&ul=en-us&de=UTF-8&dt=Google%20Analytics%20Test%20Page&sd=24-bit&sr=2560x1440&vp=1478x75&je=1&fl=12.0%20r0&_u=MACAAE~&cid=1676952207.1396992088&tid=UA-XXXX-Y&z=1676558952")
            test.equal(beacon.account, "UA-XXXX-Y");
            test.equal(beacon.trackingMethod, "Universal Analytics");
            test.equal(beacon.flashVersion, "12.0 r0");
            test.strictEqual(beacon.version, "1");
            test.strictEqual(beacon.javaEnabled, true);
            test.strictEqual(beacon.screen.width, 2560);
            test.strictEqual(beacon.screen.height, 1440);
            test.strictEqual(beacon.viewport.width, 1478);
            test.strictEqual(beacon.viewport.height, 75);
            test.strictEqual(beacon.charset, "UTF-8");
            test.strictEqual(beacon.language, "en-us");
            test.done();
        },
        'Url': function (test) {
            var beacon = new UaBeacon("http://www.google-analytics.com/collect?v=1&_v=j18&a=1938564599&t=pageview&_s=3&dl=http%3A%2F%2Fmy.website.com%2Fgadebugger%2Findex.html%3Fkey%3Dvalue&ul=en-us&de=UTF-8&dt=Google%20Analytics%20Test%20Page&sd=24-bit&sr=2560x1440&vp=1786x567&je=1&fl=12.0%20r0&_utma=37135225.316661751.1389271081.1389343534.1396974706.4&_utmz=37135225.1389271081.1.1.utmcsr%3D(direct)%7Cutmccn%3D(direct)%7Cutmcmd%3D(none)&_utmht=1397036689166&_u=MACCAE~&cid=316661751.1389271081&tid=UA-XXXX-Y&z=2073127992");
            test.strictEqual(beacon.referrer, undefined);
            test.strictEqual(beacon.documentUrl, "http://my.website.com/gadebugger/index.html?key=value");
            test.strictEqual(beacon.documentHostname, "my.website.com");
            test.strictEqual(beacon.documentPath, "/gadebugger/index.html?key=value");
            test.done();
        },
        'Custom path': function (test) {
            var beacon = new UaBeacon("http://www.google-analytics.com/collect?v=1&_v=j18&a=1938564599&t=pageview&_s=3&dl=http%3A%2F%2Fmy.website.com%2Fgadebugger%2Findex.html%3Fkey%3Dvalue&dp=%2Fcustom%2Fpath.html&ul=en-us&de=UTF-8&dt=Google%20Analytics%20Test%20Page&sd=24-bit&sr=2560x1440&vp=1786x567&je=1&fl=12.0%20r0&_utma=37135225.316661751.1389271081.1389343534.1396974706.4&_utmz=37135225.1389271081.1.1.utmcsr%3D(direct)%7Cutmccn%3D(direct)%7Cutmcmd%3D(none)&_utmht=1397036689166&_u=MACCAE~&cid=316661751.1389271081&tid=UA-XXXX-Y&z=2073127992");
            test.strictEqual(beacon.documentPath, "/custom/path.html");
            test.done();
        },
        'Custom path with query': function (test) {
            var beacon = new UaBeacon("http://www.google-analytics.com/collect?v=1&_v=j18&a=1938564599&t=pageview&_s=3&dl=http%3A%2F%2Fmy.website.com%2Fgadebugger%2Findex.html%3Fkey%3Dvalue&dp=%2Fcustom%2Fpath.html%3Frefkey%3Drefvalue&ul=en-us&de=UTF-8&dt=Google%20Analytics%20Test%20Page&sd=24-bit&sr=2560x1440&vp=1786x567&je=1&fl=12.0%20r0&_utma=37135225.316661751.1389271081.1389343534.1396974706.4&_utmz=37135225.1389271081.1.1.utmcsr%3D(direct)%7Cutmccn%3D(direct)%7Cutmcmd%3D(none)&_utmht=1397036689166&_u=MACCAE~&cid=316661751.1389271081&tid=UA-XXXX-Y&z=2073127992");
            test.strictEqual(beacon.documentPath, "/custom/path.html?refkey=refvalue");
            test.done();
        },
        'Referrer': function (test) {
            var beacon = new UaBeacon("http://www.google-analytics.com/collect?v=1&_v=j18&a=218456248&t=pageview&_s=1&dl=http%3A%2F%2Fmy.website.com%2Fgadebugger%2Findex.html&dr=http%3A%2F%2Fmy.otherwebsite.com%2Fgadebugger%2Freferrer.html&ul=en-us&de=UTF-8&dt=Google%20Analytics%20Test%20Page&sd=24-bit&sr=2560x1440&vp=1478x75&je=1&fl=12.0%20r0&_u=MACAAE~&cid=1676952207.1396992088&tid=UA-XXXX-Y&z=1676558952")
            test.strictEqual(beacon.referrer, "http://my.otherwebsite.com/gadebugger/referrer.html");
            test.done();
        },
        'Screen Name': function (test) {
            var beacon = new UaBeacon("http://www.google-analytics.com/collect?v=1&_v=j20&a=1605249003&t=pageview&_s=19&cd=Screen%20Name&dl=http%3A%2F%2Fmy.website.com%2F&dp=%2Fscreen-name-test&ul=en-us&de=UTF-8&dt=Google%20Analytics%20Test%20Page&sd=24-bit&sr=2560x1440&vp=1604x969&je=1&fl=13.0%20r0&_utma=37135225.316661751.1389271081.1399386143.1399391301.17&_utmz=37135225.1389271081.1.1.utmcsr%3D(direct)%7Cutmccn%3D(direct)%7Cutmcmd%3D(none)&_utmht=1399391406450&_u=eCCCAE~&cid=316661751.1389271081&tid=UA-XXXX-Y&z=1846790547");
            test.strictEqual(beacon.screenName, "Screen Name");
            test.done();
        }
    },
    "Page views": {
        /* TODO: fix beacon urls */
        "default": function (test) {
            var beacon = new UaBeacon("http://www.google-analytics.com/collect?v=1&_v=j18&a=218456248&t=pageview&_s=1&dl=http%3A%2F%2Fmy.website.com%2Fgadebugger%2Findex.html&ul=en-us&de=UTF-8&dt=Google%20Analytics%20Test%20Page&sd=24-bit&sr=2560x1440&vp=1478x75&je=1&fl=12.0%20r0&_u=MACAAE~&cid=1676952207.1396992088&tid=UA-XXXX-Y&z=1676558952")
            test.strictEqual(beacon.type, "pageview");
            test.strictEqual(beacon.documentTitle, "Google Analytics Test Page");
            test.strictEqual(beacon.documentUrl, "http://my.website.com/gadebugger/index.html");
            test.strictEqual(beacon.documentPath, "/gadebugger/index.html");
            test.done();
        },
        "with custom path": function (test) {
            var beacon = new UaBeacon("http://www.google-analytics.com/collect?v=1&_v=j18&a=218456248&t=pageview&_s=2&dl=http%3A%2F%2Fmy.website.com%2Fgadebugger%2Findex.html&dp=%2Fcustom%2Fpath.html&ul=en-us&de=UTF-8&dt=Google%20Analytics%20Test%20Page&sd=24-bit&sr=2560x1440&vp=1478x75&je=1&fl=12.0%20r0&_u=MACAAE~&cid=1676952207.1396992088&tid=UA-XXXX-Y&z=1657734047")
            test.strictEqual(beacon.type, "pageview");
            test.strictEqual(beacon.documentTitle, "Google Analytics Test Page");
            test.strictEqual(beacon.documentUrl, "http://my.website.com/gadebugger/index.html");
            test.strictEqual(beacon.documentPath, "/custom/path.html");
            test.done();
        }
    },
    "Events": {
        /* TODO: fix beacon urls */
        "with action and category": function (test) {
            var beacon = new UaBeacon("http://www.google-analytics.com/collect?v=1&_v=j18&a=218456248&t=event&_s=4&dl=http%3A%2F%2Fmy.website.com%2Fgadebugger%2Findex.html&ul=en-us&de=UTF-8&dt=Google%20Analytics%20Test%20Page&sd=24-bit&sr=2560x1440&vp=1478x75&je=1&fl=12.0%20r0&ec=category&ea=action&_u=MACAAE~&cid=1676952207.1396992088&tid=UA-XXXX-Y&z=2108171589")
            test.strictEqual(beacon.type, "event");
            test.strictEqual(beacon.event.category, "category");
            test.strictEqual(beacon.event.action, "action");
            test.strictEqual(beacon.event.label, undefined);
            test.strictEqual(beacon.event.value, undefined);
            test.strictEqual(beacon.event.nonInteractive, false);
            test.done();
        },
        "with action and category (non-interaction)": function (test) {
            var beacon = new UaBeacon("http://www.google-analytics.com/collect?v=1&_v=j18&a=218456248&t=event&ni=1&_s=4&dl=http%3A%2F%2Fmy.website.com%2Fgadebugger%2Findex.html&ul=en-us&de=UTF-8&dt=Google%20Analytics%20Test%20Page&sd=24-bit&sr=2560x1440&vp=1478x75&je=1&fl=12.0%20r0&ec=category&ea=action&_u=MACAAE~&cid=1676952207.1396992088&tid=UA-XXXX-Y&z=2108171589")
            test.strictEqual(beacon.type, "event");
            test.strictEqual(beacon.event.category, "category");
            test.strictEqual(beacon.event.action, "action");
            test.strictEqual(beacon.event.label, undefined);
            test.strictEqual(beacon.event.value, undefined);
            test.strictEqual(beacon.event.nonInteractive, true);
            test.done();
        },
        "with action, category and label": function (test) {
            var beacon = new UaBeacon("http://www.google-analytics.com/collect?v=1&_v=j18&a=218456248&t=event&_s=5&dl=http%3A%2F%2Fmy.website.com%2Fgadebugger%2Findex.html&ul=en-us&de=UTF-8&dt=Google%20Analytics%20Test%20Page&sd=24-bit&sr=2560x1440&vp=1478x75&je=1&fl=12.0%20r0&ec=category&ea=action&el=label&_u=MACAAE~&cid=1676952207.1396992088&tid=UA-XXXX-Y&z=1432108272");
            test.strictEqual(beacon.type, "event");
            test.strictEqual(beacon.event.category, "category");
            test.strictEqual(beacon.event.action, "action");
            test.strictEqual(beacon.event.label, "label");
            test.strictEqual(beacon.event.value, undefined);
            test.strictEqual(beacon.event.nonInteractive, false);
            test.done();
        },
        "with action, category and label (non-interaction)": function (test) {
            var beacon = new UaBeacon("http://www.google-analytics.com/collect?v=1&_v=j18&a=218456248&t=event&ni=1&_s=5&dl=http%3A%2F%2Fmy.website.com%2Fgadebugger%2Findex.html&ul=en-us&de=UTF-8&dt=Google%20Analytics%20Test%20Page&sd=24-bit&sr=2560x1440&vp=1478x75&je=1&fl=12.0%20r0&ec=category&ea=action&el=label&_u=MACAAE~&cid=1676952207.1396992088&tid=UA-XXXX-Y&z=1432108272");
            test.strictEqual(beacon.type, "event");
            test.strictEqual(beacon.event.category, "category");
            test.strictEqual(beacon.event.action, "action");
            test.strictEqual(beacon.event.label, "label");
            test.strictEqual(beacon.event.value, undefined);
            test.strictEqual(beacon.event.nonInteractive, true);
            test.done();
        },
        "with action, category, label and value": function (test) {
            var beacon = new UaBeacon("http://www.google-analytics.com/collect?v=1&_v=j18&a=267227297&t=event&_s=7&dl=http%3A%2F%2Fmy.website.com%2Fgadebugger%2Findex.html&ul=en-us&de=UTF-8&dt=Google%20Analytics%20Test%20Page&sd=24-bit&sr=2560x1440&vp=1478x75&je=1&fl=12.0%20r0&ec=category&ea=action&el=label&ev=1&_u=MACAAE~&cid=1676952207.1396992088&tid=UA-XXXX-Y&z=69130434")
            test.strictEqual(beacon.type, "event");
            test.strictEqual(beacon.event.category, "category");
            test.strictEqual(beacon.event.action, "action");
            test.strictEqual(beacon.event.label, "label");
            test.strictEqual(beacon.event.value, 1);
            test.strictEqual(beacon.event.nonInteractive, false);
            test.done();
        },
        "with action, category, label and value (non-interaction)": function (test) {
            var beacon = new UaBeacon("http://www.google-analytics.com/collect?v=1&_v=j18&a=267227297&t=event&ni=1&_s=7&dl=http%3A%2F%2Fmy.website.com%2Fgadebugger%2Findex.html&ul=en-us&de=UTF-8&dt=Google%20Analytics%20Test%20Page&sd=24-bit&sr=2560x1440&vp=1478x75&je=1&fl=12.0%20r0&ec=category&ea=action&el=label&ev=1&_u=MACAAE~&cid=1676952207.1396992088&tid=UA-XXXX-Y&z=69130434")
            test.strictEqual(beacon.type, "event");
            test.strictEqual(beacon.event.category, "category");
            test.strictEqual(beacon.event.action, "action");
            test.strictEqual(beacon.event.label, "label");
            test.strictEqual(beacon.event.value, 1);
            test.strictEqual(beacon.event.nonInteractive, true);
            test.done();
        }
    },
    "Social": {
        "with network and action": function (test) {
            var beacon = new UaBeacon("http://www.google-analytics.com/collect?v=1&_v=j20&a=1329267832&t=social&_s=10&dl=http%3A%2F%2Fmy.website.com%2F&ul=en-us&de=UTF-8&dt=Google%20Analytics%20Test%20Page&sd=24-bit&sr=2560x1440&vp=1599x1137&je=1&fl=13.0%20r0&sn=network&sa=action&_utma=37135225.316661751.1389271081.1399381608.1399386143.16&_utmz=37135225.1389271081.1.1.utmcsr%3D(direct)%7Cutmccn%3D(direct)%7Cutmcmd%3D(none)&_utmht=1399386143188&_u=MACCAE~&cid=316661751.1389271081&tid=UA-XXXX-Y&z=1018902298");
            test.strictEqual(beacon.type, "social");
            test.strictEqual(beacon.social.network, "network");
            test.strictEqual(beacon.social.action, "action");
            test.strictEqual(beacon.social.target, undefined);
            test.done();
        },
        "with network, action and target": function (test) {
            var beacon = new UaBeacon("http://www.google-analytics.com/collect?v=1&_v=j20&a=1329267832&t=social&_s=11&dl=http%3A%2F%2Fmy.website.com%2F&ul=en-us&de=UTF-8&dt=Google%20Analytics%20Test%20Page&sd=24-bit&sr=2560x1440&vp=1599x1137&je=1&fl=13.0%20r0&sn=network&sa=action&st=target&_utma=37135225.316661751.1389271081.1399381608.1399386143.16&_utmz=37135225.1389271081.1.1.utmcsr%3D(direct)%7Cutmccn%3D(direct)%7Cutmcmd%3D(none)&_utmht=1399386143190&_u=MACCAE~&cid=316661751.1389271081&tid=UA-XXXX-Y&z=2084422347");
            test.strictEqual(beacon.type, "social");
            test.strictEqual(beacon.social.network, "network");
            test.strictEqual(beacon.social.action, "action");
            test.strictEqual(beacon.social.target, "target");
            test.done();
        }
    },
    "Transaction": {
        "transaction": function (test) {
            var beacon = new UaBeacon("http://www.google-analytics.com/collect?v=1&_v=j20&a=1329267832&t=transaction&cu=EUR&_s=12&dl=http%3A%2F%2Fmy.website.com%2F&ul=en-us&de=UTF-8&dt=Google%20Analytics%20Test%20Page&sd=24-bit&sr=2560x1440&vp=1599x1137&je=1&fl=13.0%20r0&_utma=37135225.316661751.1389271081.1399381608.1399386143.16&_utmz=37135225.1389271081.1.1.utmcsr%3D(direct)%7Cutmccn%3D(direct)%7Cutmcmd%3D(none)&_utmht=1399386143211&_u=OCCCAE~&cid=316661751.1389271081&tid=UA-XXXX-Y&ti=1234&ta=affiliation&tr=12.34&ts=5.67&tt=8.90&z=851199169");
            test.strictEqual(beacon.type, "transaction");
            test.strictEqual(beacon.transaction.id, 1234);
            test.strictEqual(beacon.transaction.affiliation, "affiliation");
            test.strictEqual(beacon.transaction.revenue, 12.34);
            test.strictEqual(beacon.transaction.shipping, 5.67);
            test.strictEqual(beacon.transaction.tax, 8.90);
            test.strictEqual(beacon.transaction.currency, 'EUR');
            test.done();
        },
        "item": function (test) {
            var beacon = new UaBeacon("http://www.google-analytics.com/collect?v=1&_v=j20&a=1329267832&t=item&cu=EUR&_s=13&dl=http%3A%2F%2Fmy.website.com%2F&ul=en-us&de=UTF-8&dt=Google%20Analytics%20Test%20Page&sd=24-bit&sr=2560x1440&vp=1599x1137&je=1&fl=13.0%20r0&_utma=37135225.316661751.1389271081.1399381608.1399386143.16&_utmz=37135225.1389271081.1.1.utmcsr%3D(direct)%7Cutmccn%3D(direct)%7Cutmcmd%3D(none)&_utmht=1399386143214&_u=OCCCAE~&cid=316661751.1389271081&tid=UA-XXXX-Y&ti=1234&in=name&ic=sku&iv=category&ip=12.34&iq=1&z=2145399051");
            test.strictEqual(beacon.type, "item");
            test.strictEqual(beacon.transactionItem.transactionId, 1234);
            test.strictEqual(beacon.transactionItem.name, "name");
            test.strictEqual(beacon.transactionItem.sku, "sku");
            test.strictEqual(beacon.transactionItem.category, "category");
            test.strictEqual(beacon.transactionItem.price, 12.34);
            test.strictEqual(beacon.transactionItem.quantity, 1);
            test.done();
        }
    },
    "Custom Metrics": {
        "metrics with pageview": function (test) {
            var beacon = new UaBeacon("http://www.google-analytics.com/collect?v=1&_v=j20&a=1329267832&t=pageview&_s=17&dl=http%3A%2F%2Fmy.website.com%2F&dp=%2Fcustom-metric-test&ul=en-us&de=UTF-8&dt=Google%20Analytics%20Test%20Page&sd=24-bit&sr=2560x1440&vp=1599x1137&je=1&fl=13.0%20r0&_utma=37135225.316661751.1389271081.1399381608.1399386143.16&_utmz=37135225.1389271081.1.1.utmcsr%3D(direct)%7Cutmccn%3D(direct)%7Cutmcmd%3D(none)&_utmht=1399386143224&_u=eCCCAE~&cid=316661751.1389271081&tid=UA-XXXX-Y&cm1=1&cm2=2&cm3=3&cm4=4&cm5=5&cm6=6&cm7=7&cm8=8&cm9=9&cm10=10&cm11=11&cm12=12&cm13=13&cm14=14&cm15=15&cm16=16&cm17=17&cm18=18&cm19=19&cm20=20&z=1050541155");
            test.strictEqual(beacon.customMetrics[1], 1);
            test.strictEqual(beacon.customMetrics[2], 2);
            test.strictEqual(beacon.customMetrics[3], 3);
            test.strictEqual(beacon.customMetrics[4], 4);
            test.strictEqual(beacon.customMetrics[5], 5);
            test.strictEqual(beacon.customMetrics[6], 6);
            test.strictEqual(beacon.customMetrics[7], 7);
            test.strictEqual(beacon.customMetrics[8], 8);
            test.strictEqual(beacon.customMetrics[9], 9);
            test.strictEqual(beacon.customMetrics[10], 10);
            test.strictEqual(beacon.customMetrics[11], 11);
            test.strictEqual(beacon.customMetrics[12], 12);
            test.strictEqual(beacon.customMetrics[13], 13);
            test.strictEqual(beacon.customMetrics[14], 14);
            test.strictEqual(beacon.customMetrics[15], 15);
            test.strictEqual(beacon.customMetrics[16], 16);
            test.strictEqual(beacon.customMetrics[17], 17);
            test.strictEqual(beacon.customMetrics[18], 18);
            test.strictEqual(beacon.customMetrics[19], 19);
            test.strictEqual(beacon.customMetrics[20], 20);
            test.done();
        }
    },
    "Custom Dimensions": {
        "dimensions with pageview": function (test) {
            var beacon = new UaBeacon("http://www.google-analytics.com/collect?v=1&_v=j20&a=1329267832&t=pageview&_s=16&dl=http%3A%2F%2Fmy.website.com%2F&dp=%2Fcustom-dimension-test&ul=en-us&de=UTF-8&dt=Google%20Analytics%20Test%20Page&sd=24-bit&sr=2560x1440&vp=1599x1137&je=1&fl=13.0%20r0&_utma=37135225.316661751.1389271081.1399381608.1399386143.16&_utmz=37135225.1389271081.1.1.utmcsr%3D(direct)%7Cutmccn%3D(direct)%7Cutmcmd%3D(none)&_utmht=1399386143222&_u=eCCCAE~&cid=316661751.1389271081&tid=UA-XXXX-Y&cd1=Custom%20dimension%201%20data&cd2=Custom%20dimension%202%20data&cd3=Custom%20dimension%203%20data&cd4=Custom%20dimension%204%20data&cd5=Custom%20dimension%205%20data&cd6=Custom%20dimension%206%20data&cd7=Custom%20dimension%207%20data&cd8=Custom%20dimension%208%20data&cd9=Custom%20dimension%209%20data&cd10=Custom%20dimension%2010%20data&cd11=Custom%20dimension%2011%20data&cd12=Custom%20dimension%2012%20data&cd13=Custom%20dimension%2013%20data&cd14=Custom%20dimension%2014%20data&cd15=Custom%20dimension%2015%20data&cd16=Custom%20dimension%2016%20data&cd17=Custom%20dimension%2017%20data&cd18=Custom%20dimension%2018%20data&cd19=Custom%20dimension%2019%20data&cd20=Custom%20dimension%2020%20data&z=1614318871");
            test.strictEqual(beacon.customDimensions[1], "Custom dimension 1 data");
            test.strictEqual(beacon.customDimensions[2], "Custom dimension 2 data");
            test.strictEqual(beacon.customDimensions[3], "Custom dimension 3 data");
            test.strictEqual(beacon.customDimensions[4], "Custom dimension 4 data");
            test.strictEqual(beacon.customDimensions[5], "Custom dimension 5 data");
            test.strictEqual(beacon.customDimensions[6], "Custom dimension 6 data");
            test.strictEqual(beacon.customDimensions[7], "Custom dimension 7 data");
            test.strictEqual(beacon.customDimensions[8], "Custom dimension 8 data");
            test.strictEqual(beacon.customDimensions[9], "Custom dimension 9 data");
            test.strictEqual(beacon.customDimensions[10], "Custom dimension 10 data");
            test.strictEqual(beacon.customDimensions[11], "Custom dimension 11 data");
            test.strictEqual(beacon.customDimensions[12], "Custom dimension 12 data");
            test.strictEqual(beacon.customDimensions[13], "Custom dimension 13 data");
            test.strictEqual(beacon.customDimensions[14], "Custom dimension 14 data");
            test.strictEqual(beacon.customDimensions[15], "Custom dimension 15 data");
            test.strictEqual(beacon.customDimensions[16], "Custom dimension 16 data");
            test.strictEqual(beacon.customDimensions[17], "Custom dimension 17 data");
            test.strictEqual(beacon.customDimensions[18], "Custom dimension 18 data");
            test.strictEqual(beacon.customDimensions[19], "Custom dimension 19 data");
            test.strictEqual(beacon.customDimensions[20], "Custom dimension 20 data");
            test.done();

            /*var x = {};
            Object.getOwnPropertyNames(UaBeacon.prototype).forEach(function(prop) {
                x[prop]=beacon[prop];
                //console.log(beacon[prop])
            });
            console.log(x)*/
            //console.log(JSON.stringify(beacon.getOwnProperties()));
        }
    },
    "Content Groups": {
        "content group": function (test) {
            var beacon = new UaBeacon("http://www.google-analytics.com/collect?v=1&_v=j20&a=1329267832&t=pageview&_s=18&dl=http%3A%2F%2Fmy.website.com%2F&dp=%2Fcontent-group-test&ul=en-us&de=UTF-8&dt=Google%20Analytics%20Test%20Page&sd=24-bit&sr=2560x1440&vp=1599x1137&je=1&fl=13.0%20r0&_utma=37135225.316661751.1389271081.1399381608.1399386143.16&_utmz=37135225.1389271081.1.1.utmcsr%3D(direct)%7Cutmccn%3D(direct)%7Cutmcmd%3D(none)&_utmht=1399386143226&_u=eCCCAE~&cid=316661751.1389271081&tid=UA-XXXX-Y&cg1=Content%20Group%201&cg2=Content%20Group%202&cg3=Content%20Group%203&cg4=Content%20Group%204&cg5=Content%20Group%205&z=50445309");
            test.strictEqual(beacon.contentGroups[1], "Content Group 1");
            test.strictEqual(beacon.contentGroups[2], "Content Group 2");
            test.strictEqual(beacon.contentGroups[3], "Content Group 3");
            test.strictEqual(beacon.contentGroups[4], "Content Group 4");
            test.strictEqual(beacon.contentGroups[5], "Content Group 5");
            test.done();
        }
    },
    "User Timings": {
        "with category, var and value": function (test) {
            var beacon = new UaBeacon("http://www.google-analytics.com/collect?v=1&_v=j20&a=1329267832&t=timing&_s=14&dl=http%3A%2F%2Fmy.website.com%2F&ul=en-us&de=UTF-8&dt=Google%20Analytics%20Test%20Page&sd=24-bit&sr=2560x1440&vp=1599x1137&je=1&fl=13.0%20r0&utc=Category&utv=Var&utt=1234&_utma=37135225.316661751.1389271081.1399381608.1399386143.16&_utmz=37135225.1389271081.1.1.utmcsr%3D(direct)%7Cutmccn%3D(direct)%7Cutmcmd%3D(none)&_utmht=1399386143216&_u=OCCCAE~&cid=316661751.1389271081&tid=UA-XXXX-Y&z=570768512");
            test.strictEqual(beacon.userTimings.category, "Category");
            test.strictEqual(beacon.userTimings.variable, "Var");
            test.strictEqual(beacon.userTimings.value, 1234);
            test.done();
        },
        "with category, var, value and label": function (test) {
            var beacon = new UaBeacon("http://www.google-analytics.com/collect?v=1&_v=j20&a=1329267832&t=timing&_s=15&dl=http%3A%2F%2Fmy.website.com%2F&ul=en-us&de=UTF-8&dt=Google%20Analytics%20Test%20Page&sd=24-bit&sr=2560x1440&vp=1599x1137&je=1&fl=13.0%20r0&utc=Category&utv=Var&utl=Label&utt=1234&_utma=37135225.316661751.1389271081.1399381608.1399386143.16&_utmz=37135225.1389271081.1.1.utmcsr%3D(direct)%7Cutmccn%3D(direct)%7Cutmcmd%3D(none)&_utmht=1399386143219&_u=OCCCAE~&cid=316661751.1389271081&tid=UA-XXXX-Y&z=1787606110");
            test.strictEqual(beacon.userTimings.category, "Category");
            test.strictEqual(beacon.userTimings.variable, "Var");
            test.strictEqual(beacon.userTimings.value, 1234);
            test.strictEqual(beacon.userTimings.label, "Label");
            test.done();
        }
    }
}