/* global UI */

UI.Toolbar = (function() {

    'use strict';

    var toolbars = document.querySelectorAll('[data-ui-type="toolbar"]');

    for (var c=0; c<toolbars.length; c++) {
        initToolbar(toolbars[c]);
    }

    function dispatchEvent(elem, name, detail) {
        var event = new CustomEvent(name, {
            detail: detail,
            bubbles: true
        });
        return elem.dispatchEvent(event);
    }

    function isToolbarButton(elem) {
        return elem.classList.contains('toolbar__button');
    }

    function initToolbar(toolbar) {
        toolbar.addEventListener('click', function (e) {
            var elem = e.target,
                button;

            while (elem && elem !== toolbar) {
                if (isToolbarButton(elem)) {
                    button = elem;
                }
                elem = elem.parentNode;
            }

            if (button) {
                toggleButton(button);
            }
        });
    }

    function toggleButton(button) {
        if (button.classList.contains('toolbar__button--toggled-off')) {
            if (dispatchEvent(button, 'toggle', true)) {
                button.classList.remove('toolbar__button--toggled-off');
                button.classList.add('toolbar__button--toggled-on');
            }
        } else if (button.classList.contains('toolbar__button--toggled-on')) {
            if (dispatchEvent(button, 'toggle', false)) {
                button.classList.remove('toolbar__button--toggled-on');
                button.classList.add('toolbar__button--toggled-off');
            }
        }
    }

}());
