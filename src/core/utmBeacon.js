/* global Utils */
/* exported UtmBeacon */

var UtmBeacon = (function() {

    'use strict';

    var RE_PIXEL_PARAMS = /[?&](utm[a-z]+)=([^&]*)/g,                   // __utm.gif?utmXXX=YYY...
        RE_COOKIE_PARAMS = /(?:^|;)\+?__(utm[a-z]+)=([^;]*)/g,          // __utma=XXX;__umtz=YYY;...
        RE_COOKIE_DATA = /(?:^|\|)(utm[a-z]+)=([^|]*)/g,                // utmccn=XXX|utmcmd=YYY...
        RE_EXTENSIBLE_DATA = /(\d+)\((.*?)\)(?=\d|$)/g,
        RE_CONTENT_GROUP = /(\d):([^,]+)/g;

    function parseVariableData (data, slots, property, convertor) {
        var slot = 0;
        data.split('*').forEach(function (key) {
            var parts = key.split('!');
            var value = parts.pop();
            if (parts.length) {
                slot = parts.pop() | 0;
            } else {
                slot++;
            }
            if (!slots[slot]) {
                slots[slot] = {
                    slot: slot,
                    scope: 3 // Default scope is page level (3)
                };
            }
            if (convertor) {
                value = convertor.call(null, value);
            }
            slots[slot][property] = value;
        });
    }

    function unescapeValue (val) {
        return val.replace(/'([0-3])/, function(m,i) {
            return '\')*!'.charAt(i | 0);
        });
    }

    function CustomVar(slot, key, value, scope) {
        this.slot = slot;
        this.key = key;
        this.value = value;
        this.scope = scope;
    }

    CustomVar.prototype.toString = function() {
        return this.key + '=' + this.value;
    };


    function UtmBeacon (url) {
        this.params = Utils.parseDataToObject(RE_PIXEL_PARAMS, url);
    }


    Object.defineProperties(UtmBeacon.prototype, {
        trackingMethod: {
            get: function() {
                return 'Traditional Analytics';
            }
        },
        version: {
            get: function() {
                return this.params.utmwv;
            }
        },
        visitorId: {
            get: function() {
                var data = Utils.parseDataToObject(RE_COOKIE_PARAMS, this.params.utmcc);
                if (data && data.utma) {
                    return data.utma;
                }
            }
        },
        sessionId: {
            get: function() {
                var data = Utils.parseDataToObject(RE_COOKIE_PARAMS, this.params.utmcc);
                if (data && data.utmb) {
                    return data.utmb;
                }
            }
        },
        type: {
            get: function() {
                if (this.params.utmt === 'tran') {
                    return 'transaction';
                }
                return this.params.utmt || 'pageview';
            }
        },
        documentTitle: {
            get: function() {
                return this.params.utmdt;
            }
        },
        documentUrl: {
            get: function() {
                return 'http://' + this.params.utmhn + this.params.utmp;
            }
        },
        documentHostname: {
            get: function() {
                return this.params.utmhn;
            }
        },
        documentPath: {
            get: function() {
                return this.params.utmp;
            }
        },
        referrer: {
            get: function() {
                return this.params.utmr;
            }
        },
        charset: {
            get: function() {
                return this.params.utmcs;
            }
        },
        flashVersion: {
            get: function() {
                return this.params.utmfl;
            }
        },
        javaEnabled: {
            get: function() {
                return this.params.utmje === '1';
            }
        },
        language: {
            get: function() {
                return this.params.utmul;
            }
        },
        account: {
            get: function() {
                return this.params.utmac;
            }
        },
        viewport: {
            get: function() {
                if (this.params.utmvp) {
                    return Utils.parseDimensions(this.params.utmvp);
                }
            }
        },
        screen: {
            get: function() {
                if (this.params.utmsr) {
                    return Utils.parseDimensions(this.params.utmsr);
                }
            }
        },
        colorDepth: {
            get: function() {
                return this.params.utmsc;
            }
        },
        event: {
            get: function() {
                var data, value;
                if (this.type === 'event') {
                    data = Utils.parseDataToObject(RE_EXTENSIBLE_DATA, this.params.utme)[5];
                    if (data) {
                        data = data.split(/\*|\)\(/).map(unescapeValue);
                        value = parseFloat(data[3]);
                        if (isNaN(value)) {
                            value = undefined;
                        }
                        return {
                            category: data[0],
                            action: data[1],
                            label: data[2],
                            value: value,
                            nonInteractive: this.params.utmni === '1'
                        };
                    }
                }
            }
        },
        campaignData: {
            get: function() {
                var data = Utils.parseDataToObject(RE_COOKIE_PARAMS, this.params.utmcc);
                if (data && data.utmz) {
                    data = data.utmz.match(/(^[\d.]+)\.(.*)$/);
                    if (data) {
                        data = Utils.parseDataToObject(RE_COOKIE_DATA, data[2]);
                        return {
                            name: data.utmccn,
                            source: data.utmcsr,
                            medium: data.utmcmd,
                            content: data.utmcct,
                            term: data.utmctr
                        };
                    }
                }
            }
        },
        customVars: {
            get: function() {
                var data = Utils.parseDataToObject(RE_EXTENSIBLE_DATA, this.params.utme),
                    keys = data[8],
                    values = data[9],
                    scopes = data[11],
                    slots = {};

                if (keys && values) {
                    parseVariableData(keys, slots, 'key', unescapeValue);
                    parseVariableData(values, slots, 'value', unescapeValue);
                    if (scopes) {
                        parseVariableData(scopes, slots, 'scope', parseInt);
                    }
                    return Object.keys(slots).map(function (slot) {
                        return new CustomVar(parseInt(slot), slots[slot].key, slots[slot].value, slots[slot].scope);
                        //return slots[slot];
                    });
                }
            }
        },
        social: {
            get: function() {
                if (this.type === 'social') {
                    return {
                        network: this.params.utmsn,
                        action: this.params.utmsa,
                        target: this.params.utmsid,
                        path: this.path // TODO: check this
                    };
                }
            }
        },
        transaction: {
            get: function() {
                if (this.type === 'transaction') {
                    return {
                        id: parseInt(this.params.utmtid, 10),
                        revenue: parseFloat(this.params.utmtto) || 0,
                        tax: parseFloat(this.params.utmttx) || 0,
                        shipping: parseFloat(this.params.utmtsp) || 0,
                        affiliation: this.params.utmtst,
                        city: this.params.utmtci,
                        country: this.params.utmtco,
                        region: this.params.utmtrg
                    };
                }
            }
        },
        transactionItem: {
            get: function() {
                if (this.type === 'item') {
                    return {
                        transactionId: parseInt(this.params.utmtid, 10),
                        sku: this.params.utmipc,
                        name: this.params.utmipn,
                        category: this.params.utmiva,
                        price: parseFloat(this.params.utmipr),
                        quantity: parseInt(this.params.utmiqt, 10)
                    };
                }
            }
        },
        timingData: {
            get: function() {
                var data;
                if (this.type === 'event') {
                    data = Utils.parseDataToObject(RE_EXTENSIBLE_DATA, this.params.utme)[14];
                    if (data) {
                        data = data.split(/[!|\*|\)\(]/).map(unescapeValue);
                        return {
                            category: data[2],
                            variable: data[1],
                            time: parseFloat(data[3]),
                            label: data[4]
                        };
                    }
                }
            }
        },
        contentGroups: {
            get: function() {
                return Utils.parseDataToObject(RE_CONTENT_GROUP, this.params.utmpg);
            }
        }
    });

    return UtmBeacon;

}());