/* global UI */

UI.Window = (function(){

    'use strict';

    document.querySelector('body').classList.add(
        'dev-tools-theme-' + chrome.devtools.panels.themeName
    )

    window.addEventListener('focus', function() {
        document.body.classList.remove('state--inactive');
    });

    window.addEventListener('blur', function() {
        document.body.classList.add('state--inactive');
    });
}());
