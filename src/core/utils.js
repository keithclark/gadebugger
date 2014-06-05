/* exported Utils */

var Utils = (function() {

    'use strict';

    var RE_URI = /^(?:(https?):)?(?:\/\/([^\/?#]+))?(\/[^?#]*)?(\?[^#]*)?(#.*)?$/;

    function parseUri(uri) {
        var fragments = RE_URI.exec(uri);
        if (fragments) {
            return {
                protocol: fragments[1],
                hostname: fragments[2],
                path: fragments[3],
                query: fragments[4],
                hash: fragments[5]
            };
        }
    }

    function parseDataToObject(re, data) {
        var keyValue, obj = {};
        while ((keyValue = re.exec(data))) {
            obj[keyValue[1]] = decodeURIComponent(keyValue[2]);
        }
        return obj;
    }

    function parseDimensions(data) {
        var dimensions = data.split('x');
        return new Dimension(dimensions[0], dimensions[1]);
        /*return {
            width: dimensions[0] | 0,
            height: dimensions[1] | 0
        };*/
    }

    function Dimension(width, height) {
        this.width = width | 0;
        this.height = height | 0;
    }

    Dimension.prototype.toString = function() {
        return this.width + 'x' + this.height;
    };

    return {
        parseUri: parseUri,
        parseDataToObject: parseDataToObject,
        parseDimensions: parseDimensions
    };

}());