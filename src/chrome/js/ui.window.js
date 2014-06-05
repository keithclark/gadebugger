/* global UI */

UI.Window = (function(){

    'use strict';

    window.addEventListener('focus', function() {
        document.body.classList.remove('state--inactive');
    });

    window.addEventListener('blur', function() {
        document.body.classList.add('state--inactive');
    });
}());