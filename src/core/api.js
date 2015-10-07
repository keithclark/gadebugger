/* global Utils, UaBeacon, UtmBeacon */
/* exported GACoreAPI */
var GACoreAPI = (function() {

    'use strict';

    var HOSTS = [
        'www.google-analytics.com',
        'ssl.google-analytics.com',
        'stats.g.doubleclick.net'
    ];

    function isBeaconUrl(url) {
        var uri = Utils.parseUri(url);
        return uri && HOSTS.indexOf(uri.hostname) > -1 &&
            (uri.path === '/collect' || uri.path === '/__utm.gif');
    }

    function parseBeacon(url) {
        var uri = Utils.parseUri(url),
            beacon;

        if (uri && HOSTS.indexOf(uri.hostname) > -1) {
            if (uri.path === '/collect') {
                beacon = new UaBeacon(url);
            } else if (uri.path === '/__utm.gif') {
                beacon = new UtmBeacon(url);
            }
        }

        return beacon;
    }

    function createBeaconHint(beacon) {
        var hint;

        if (beacon.type === 'transaction') {
            hint = beacon.transaction.revenue.toString();
            if (beacon.transaction.currency) {
                hint += ' ' + beacon.transaction.currency;
            }
        } else if (beacon.type === 'item') {
            hint = beacon.transactionItem.name + ' (x' + beacon.transactionItem.quantity + ')';
        } else if (beacon.type === 'social') {
            hint = beacon.social.network + ' / ' + beacon.social.action;
        } else if (beacon.type === 'event') {
            hint = beacon.event.category;
            if (beacon.event.action) {
                hint += ' / ' + beacon.event.action;
            }
            if (beacon.event.label) {
                hint += ' / ' + beacon.event.label;
            }
            if (beacon.event.value) {
                hint += ' / ' + beacon.event.value;
            }
        } else if (beacon.type === 'pageview') {
            hint = beacon.documentPath;
        } else if (beacon.type === 'timing') {
            hint = beacon.userTimings.category + ' / ' + beacon.userTimings.variable + ' / ' + beacon.userTimings.value + 'ms';
            if (beacon.userTimings.label) {
                hint += ' / ' + beacon.userTimings.label;
            }
        }
        return hint;
    }

    return {
        isBeaconUrl: function(url) {
            return isBeaconUrl(url);
        },
        parseBeacon: function(url) {
            return parseBeacon(url);
        },
        createBeaconHint: createBeaconHint
    };
}());
