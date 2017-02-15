'use strict';

const { classes: Cc, interfaces: Ci, utils: Cu, results: Cr } = Components;

Cu.import('resource://gre/modules/Services.jsm');
Cu.import('resource://gre/modules/XPCOMUtils.jsm');
Cu.import('resource://devtools/client/framework/gDevTools.jsm');

XPCOMUtils.defineLazyGetter(this, 'osString', () => Cc['@mozilla.org/xre/app-info;1'].getService(Ci.nsIXULRuntime).OS);
XPCOMUtils.defineLazyGetter(this, 'toolStrings', () => Services.strings.createBundle('chrome://gadebugger/locale/strings.properties'));
XPCOMUtils.defineLazyGetter(this, 'toolDefinition', () => ({
    id: 'gadebugger',
    icon: 'chrome://gadebugger/skin/icon.svg',
    url: 'chrome://gadebugger/content/tool.xul',
    label: toolStrings.GetStringFromName('devtoolsLabel'),
    tooltip: toolStrings.GetStringFromName('devtoolsTooltip'),
    invertIconForLightTheme: true,
    inMenu: true,
    ordinal: 99,
    isTargetSupported: function(target) {
        return target.isLocalTab;
    },
    build: function(iframeWindow, toolbox) {
        Cu.import('chrome://gadebugger/content/panel.js');
        let panel = new GADebuggerPanel(iframeWindow, toolbox);
        return panel.open();
    }
}));

function startup() {
    gDevTools.registerTool(toolDefinition);
}

function shutdown() {
    gDevTools.unregisterTool(toolDefinition);
    Services.obs.notifyObservers(null, 'startupcache-invalidate', null);
}

function install() {}

function uninstall() {}
