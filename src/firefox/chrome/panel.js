'use strict';

this.EXPORTED_SYMBOLS = ['GADebuggerPanel'];

function GADebuggerPanel(iframeWindow, toolbox) {
    this.panelWin = iframeWindow;
    this._toolbox = toolbox;
};

GADebuggerPanel.prototype = {
    get target() {
        return this._toolbox.target;
    },
    open: function() {
        return this.panelWin.startup(this._toolbox, this.target).then(() => {
            this.isReady = true;
            return this;
        });
    },
    destroy: function() {
        return this.panelWin.shutdown().then(() => {
            this.isReady = false;
        });
    }
};
