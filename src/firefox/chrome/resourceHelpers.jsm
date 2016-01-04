// Devtools paths changed in version 44 Firefox which will breakx GA Debugger.
// This helper module provides methods for mapping new URLs to the one ones
// (depending on the current version of Firefox.) It also provides methods for
// injecting assets into an XUL document.
//
// ** This is a temporary fix and will remain here unitl the old versions are
// phased out, at which point the min version for this extension will be changed
// to 44 **

'use strict';

const { classes: Cc, interfaces: Ci, utils: Cu, results: Cr } = Components;

this.EXPORTED_SYMBOLS = ['ResourceHelpers'];

let FirefoxInfo = Cc['@mozilla.org/xre/app-info;1'].getService(Ci.nsIXULAppInfo),
    FirefoxMajorVer = parseInt(FirefoxInfo.version),
    ResourceHelpers = {
        resolveUrl: resolveUrl,
        insertStyleSheet: insertStyleSheet,
        importModule: importModule
    };

function resolveUrl(url) {
    if (FirefoxMajorVer < 44) {
        url = url.replace('resource://devtools/client/shared/widgets/', 'resource:///modules/devtools/');
        url = url.replace('chrome://devtools/content/shared/widgets/', 'chrome://browser/content/devtools/');
        url = url.replace('chrome://devtools/content/', 'chrome://browser/content/');
        url = url.replace('chrome://devtools/skin/', 'chrome://browser/skin/devtools/');
    } else if (FirefoxInfo.version === '44.0a2') {
        url = url.replace('chrome://devtools/skin/', 'chrome://devtools/skin/themes/');
    }
    return url;
}

function insertStyleSheet(url, doc) {
    var pi = doc.createProcessingInstruction('xml-stylesheet', 'href="' + resolveUrl(url) + '" type="text/css"');
    doc.insertBefore(pi, doc.firstChild);
}

function importModule(url, scope) {
    Cu.import(resolveUrl(url), scope);
}
