'use strict';

const { classes: Cc, interfaces: Ci, utils: Cu, results: Cr } = Components;

this.EXPORTED_SYMBOLS = ['GADebuggerPanel'];

Cu.import('resource://gre/modules/XPCOMUtils.jsm');

XPCOMUtils.defineLazyModuleGetter(this, 'EventEmitter','resource://gre/modules/devtools/event-emitter.js');
XPCOMUtils.defineLazyModuleGetter(this, 'promise', 'resource://gre/modules/commonjs/sdk/core/promise.js', 'Promise');

function GADebuggerPanel(iframeWindow, toolbox) {
    this.panelWin = iframeWindow;
    this._toolbox = toolbox;
    EventEmitter.decorate(this);
};

GADebuggerPanel.prototype = {
    get target() this._toolbox.target,
    open: function() {
        return this.panelWin.startup(this._toolbox, this.target).then(() => {
            this.isReady = true;
            this.emit('ready');
            return this;
        });
    },
    destroy: function() {
        return this.panelWin.shutdown().then(() => {
            this.isReady = false;
            this.emit('destroyed');
        });
    }
};
