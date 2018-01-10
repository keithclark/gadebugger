/* global Utils */
/* exported UaBeacon */

var UaBeacon = (function() {

    'use strict';

    var RE_PIXEL_PARAMS = /[?&]([a-z][a-z0-9]*)=([^&]*)/g;                  // __utm.gif?utmXXX=YYY...

    function UaBeacon (url) {
        this.params = Utils.parseDataToObject(RE_PIXEL_PARAMS, url);
    }

    Object.defineProperties(UaBeacon.prototype, {
        trackingMethod: {
            get: function() {
                return 'Universal Analytics';
            }
        },
        version: {
            get: function() {
                return this.params.v;
            }
        },
        clientId: {
            get: function() {
                return this.params.cid;
            }
        },
        type: {
            get: function() {
                return this.params.t;
            }
        },
        documentUrl: {
            get: function() {
                return this.params.dl;
            }
        },
        documentTitle: {
            get: function() {
                return this.params.dt;
            }
        },
        documentHostname: {
            get: function() {
                return this.params.dh || Utils.parseUri(this.params.dl).hostname;
            }
        },
        documentPath: {
            get: function() {
                var url;
                if (this.params.dp) {
                    return this.params.dp;
                }
                url = Utils.parseUri(this.params.dl);
                return url.path + (url.query || '') + (url.hash || '');
            }
        },
        screenName: {
            get: function() {
                return this.params.cd;
            }
        },
        path: {
            get: function() {
                return Utils.parseUri(this.params.dp || this.params.dl).path;
            }
        },
        customPath: {
            get: function() {
                return this.params.dp;
            }
        },
        referrer: {
            get: function() {
                return this.params.dr;
            }
        },
        charset: {
            get: function() {
                return this.params.de;
            }
        },
        flashVersion: {
            get: function() {
                return this.params.fl;
            }
        },
        javaEnabled: {
            get: function() {
                return this.params.je === '1';
            }
        },
        language: {
            get: function() {
                return this.params.ul;
            }
        },
        account: {
            get: function() {
                return this.params.tid;
            }
        },
        viewport: {
            get: function() {
                if (this.params.vp) {
                    return Utils.parseDimensions(this.params.vp);
                }
            }
        },
        screen: {
            get: function() {
                if (this.params.sr) {
                    return Utils.parseDimensions(this.params.sr);
                }
            }
        },
        colorDepth: {
            get: function() {
                return this.params.sd;
            }
        },
        event: {
            get: function() {
                var value;
                if (this.type === 'event') {
                    value = parseFloat(this.params.ev);
                    if (isNaN(value)) {
                        value = undefined;
                    }
                    return {
                        category: this.params.ec,
                        action: this.params.ea,
                        label: this.params.el,
                        value: value,   // TODO: check int or float
                        nonInteractive: this.params.ni === '1'
                    };
                }
            }
        },
        campaignData: {
            get: function() {
                if (this.params.cn || this.params.cs || this.params.cm) {
                    return {
                        name: this.params.cn,
                        source: this.params.cs,
                        medium: this.params.cm,
                        content: this.params.cc,
                        term: this.params.ck
                    };
                }
            }
        },
        social: {
            get: function() {
                if (this.type === 'social') {
                    return {
                        network: this.params.sn,
                        action: this.params.sa,
                        target: this.params.st
                        //path: this.path // TODO: check this
                    };
                }
            }
        },
        transaction: {
            get: function() {
                if (this.type === 'transaction') {
                    return {
                        id: parseInt(this.params.ti, 10),
                        affiliation: this.params.ta,
                        revenue: parseFloat(this.params.tr) || 0,
                        shipping: parseFloat(this.params.ts) || 0,
                        tax: parseFloat(this.params.tt) || 0,
                        currency: this.params.cu
                    };
                }
            }
        },
        transactionItem: {
            get: function() {
                if (this.type === 'item') {
                    return {
                        transactionId: parseInt(this.params.ti, 10),
                        sku: this.params.ic,
                        name: this.params.in,
                        category: this.params.iv,
                        price: parseFloat(this.params.ip),
                        quantity: parseInt(this.params.iq, 10),
                        currency: this.params.cu
                    };
                }
            }
        },
        userTimings: {
            get: function() {
                if (this.type === 'timing') {
                    return {
                        category: this.params.utc,
                        variable: this.params.utv,
                        value: parseInt(this.params.utt, 10),
                        label: this.params.utl
                    };
                }
            }
        },
        customMetrics: {
            get: function() {
                var data = {}, value, c;
                for (c = 1; c <= 200; c++) {
                    value = this.params['cm' + c];
                    if (value !== undefined) {
                        data[c] = parseInt(value, 10);
                    }
                }
                return data;
            }
        },
        customDimensions: {
            get: function() {
                var data = {}, value, c;
                for (c = 1; c <= 200; c++) {
                    value = this.params['cd' + c];
                    if (value !== undefined) {
                        data[c] = value;
                    }
                }
                return data;
            }
        },
        contentGroups: {
            get: function() {
                var data = {}, value, c;
                for (c = 1; c <= 5; c++) {
                    value = this.params['cg' + c];
                    if (value !== undefined) {
                        data[c] = value;
                    }
                }
                return data;
            }
        },
        experiment: {
            get: function() {
                if (this.params.xid) {
                    return {
                        id: this.params.xid,
                        variant: parseInt(this.params.xvar, 10)
                    };
                }
            }
        }
    });

    return UaBeacon;

}());