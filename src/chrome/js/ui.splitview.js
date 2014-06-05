/* global UI */

UI.SplitView = (function() {

    'use strict';

    var splitters = document.querySelectorAll('.splitview__splitter'),
        originX, prevPanel, nextPanel,
        prevPanelWidth, nextPanelWidth;

    function startDrag(e) {
        originX = e.pageX;
        prevPanel = e.target.previousElementSibling;
        nextPanel = e.target.nextElementSibling;
        prevPanelWidth = prevPanel.offsetWidth;
        nextPanelWidth = nextPanel.offsetWidth;
        document.addEventListener('mousemove', doDrag);
        document.addEventListener('mouseup', endDrag);
        e.preventDefault();
    }

    function doDrag(e) {
        var delta = originX - e.pageX;
        if (prevPanel.style.width !== 'auto') {
            prevPanel.style.width = (prevPanelWidth - delta) + 'px';
        }
        if (nextPanel.style.width !== 'auto') {
            nextPanel.style.width = (nextPanelWidth + delta) + 'px';
        }
    }

    function endDrag() {
        document.removeEventListener('mousemove', doDrag);
        document.removeEventListener('mouseup', endDrag);
    }

    for (var c = 0; c < splitters.length; c++) {
        splitters[c].addEventListener('mousedown', startDrag);
    }

}());