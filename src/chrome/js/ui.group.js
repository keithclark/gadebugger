/* global UI */

UI.Group = (function() {

    'use strict';

    document.addEventListener('click', function(e) {
        var elem = e.target;
        if (elem.classList.contains('group__header')) {
            elem.parentNode.classList.toggle('group--collapsed');
        }
    });

}());