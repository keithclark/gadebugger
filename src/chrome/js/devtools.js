/* global chrome */
chrome.devtools.panels.create('GA Debugger', 'img/icon-48.png', 'index.html', function (panel) {

    'use strict';

    var captureButton = panel.createStatusBarButton('img/record-off.png', 'Start capturing', false),
        clearButton = panel.createStatusBarButton('img/clear.png', 'Clear', false);

    panel.onShown.addListener(function init(panelWindow) {
        
        var capturing = false;

        panel.onShown.removeListener(init);

        function requestHandler(request) {
            panelWindow.GADebugger.process(request.request.url);
        }

        captureButton.onClicked.addListener(function() {
            capturing = !capturing;
            if (capturing) {
                chrome.devtools.network.onRequestFinished.addListener(requestHandler);
                captureButton.update('img/record-on.png', 'Stop capturing');
            } else {
                chrome.devtools.network.onRequestFinished.removeListener(requestHandler);
                captureButton.update('img/record-off.png', 'Start capturing');
            }
        });

        clearButton.onClicked.addListener( function() {
            panelWindow.GADebugger.clear();
        });

        panelWindow.GADebugger.clear();
    });
});


