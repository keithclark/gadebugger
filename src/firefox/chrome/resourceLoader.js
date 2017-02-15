// GA Debugger uses a few of devtools internal assets for various UI elements
// such as the split view and beacon inspector (a VariableView). Unfortunately,
// the Devtools framework is in a state of flux, with asset paths and import
// methods changing regularly with each release of Firefox.
//
// This helper module provides methods for loading script dependencies in either
// commonJS or the older JSM format. Method calls accept the latest paths,
// resolving them to the correct location for the current browser version. The 
// correct commonJS or JSM module is then loaded and returned to the caller.
//
// It also provides methods for loading stylesheets (again, with differing paths)
// into an XUL document.
//
// ** This is a temporary fix and will remain here unitl the old versions are
// phased out, at which point the min version for this extension will be changed
// to 44 **

'use strict';

const { classes: Cc, interfaces: Ci, utils: Cu, results: Cr } = Components;
const appInfo = Cc['@mozilla.org/xre/app-info;1'].getService(Ci.nsIXULAppInfo);
const appMajorVer = parseInt(appInfo.version);

let ResourceLoader = {},
    require;

if (appMajorVer >= 48) {
    require = Cu.import("resource://devtools/shared/Loader.jsm", {}).require;
}

ResourceLoader.require = function (url) {

    if (url === 'devtools/client/shared/widgets/view-helpers') {
        if (appMajorVer < 44) {
            // Prior to v44, ViewHelpers was in a different directory. (see: https://bugzil.la/912121)
            url = 'resource:///modules/devtools/ViewHelpers.jsm';
        } else if (appMajorVer < 49) {
            // Prior to v49, ViewHelpers was JSM. from 49 it's a commonJS module
            url = 'resource://devtools/client/shared/widgets/ViewHelpers.jsm';
        }
    } else if (url === 'devtools/shared/event-emitter') {
        // Proior to v48, event-emitter must be loaded as JSM
        if (appMajorVer < 44) {
            return Cu.import('resource://gre/modules/devtools/event-emitter.js', {}).EventEmitter;
        } else if (appMajorVer < 48) {
            return Cu.import('resource://devtools/shared/event-emitter.js', {}).EventEmitter;
        }
    } else if (url === 'resource://devtools/client/shared/widgets/SideMenuWidget.jsm') {
        // Proior to v44, SideMenuWidget.jsm existed elsewhere. (see: https://bugzil.la/912121)
        if (appMajorVer < 44) {
            url = 'resource:///modules/devtools/SideMenuWidget.jsm';
        }
    } else if (url === 'resource://devtools/client/shared/widgets/VariablesView.jsm') {
        // Proior to v44, VariablesView.jsm existed elsewhere. (see: https://bugzil.la/912121)
        if (appMajorVer < 44) {
            url = 'resource:///modules/devtools/VariablesView.jsm';
        }
    } else if (url === 'promise') {
        // Proior to v48, promise must be loaded as JSM
        if (appMajorVer < 48) {
            return Cu.import('resource://gre/modules/Promise.jsm', {}).Promise;
        }
    }

    if (appMajorVer >= 48 && !url.endsWith('.jsm')) {
        return require(url);
    } else {
        return Cu.import(url, {});
    }
}


ResourceLoader.loadStyleSheet = function(url, doc) {
    if (appMajorVer < 44) {
        if (url === 'chrome://devtools/content/shared/widgets/widgets.css') {
            url = 'chrome://browser/content/devtools/widgets.css';            
        } else {
            url = url.replace('chrome://devtools/skin/', 'chrome://browser/skin/devtools/')
        }
    }
    var pi = doc.createProcessingInstruction('xml-stylesheet', 'href="' + url + '" type="text/css"');
    doc.insertBefore(pi, doc.firstChild);
}


ResourceLoader.getAppMajorVersion = function () {
    return appMajorVer;
}

this.EXPORTED_SYMBOLS = ['ResourceLoader'];
