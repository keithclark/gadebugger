/* global UI */

UI.Utils = (function() {

    'use strict';

    function createElem(props) {
        var elem = document.createElement(props.tag);

        if (props.attrs) {
            Object.keys(props.attrs).forEach(function (key) {
                elem.setAttribute(key, props.attrs[key]);
            });
        }
        if (props.html) {
            elem.innerHTML = props.html;
        }
        if (props.text) {
            elem.textContent = props.text;
        }
        if (props.children) {
            props.children.forEach(function (child) {
                elem.appendChild(createElem(child));
            });
        }
        return elem;
    }

    function emptyElem(elem) {
        while (elem.hasChildNodes()) {
            elem.removeChild(elem.firstChild);
        }
    }

    function htmlEncode(str) {
        return str.replace(/[<&>]/g, function (chr) {
            return '&#' + chr.charCodeAt() + ';';
        });
    }

    function findControl(elem, type) {
        while (elem && elem.dataset.uiType !== type) {
            elem = elem.parentElement;
        }
        return elem;
    }

    return {
        createElem: createElem,
        emptyElem: emptyElem,
        htmlEncode: htmlEncode,
        findControl: findControl
    };

}());