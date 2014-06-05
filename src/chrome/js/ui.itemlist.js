/* global UI */

UI.ItemList = (function() {

    'use strict';

    /**
     * Returns the currently selected element for the given list
     */
    function getSelection(list) {
        return list.querySelector('[data-ui-type="item-list-item"].state--selected');
    }

    /**
     * Returns the value of the currently selected element for the given list
     */
    function getSelectionValue(list) {
        var selection = getSelection(list);
        if (selection) {
            return selection.dataset.value;
        } else {
            return null;
        }
    }

    /**
     * Sets the current selection for the given list
     */
    function setSelection(list, item) {
        var lastItem = getSelection(list),
            value = null;

        if (item !== lastItem) {
            if (lastItem) {
                lastItem.classList.remove('state--selected');
            }
            if (item) {
                item.classList.add('state--selected');
                value = item.dataset.value;
            }
            list.dispatchEvent(new CustomEvent('change', {
                detail: value,
                bubbles: true
            }));
        }
    }


    // Capture user interactions and update list selection
    document.addEventListener('click', function(e) {
        var item, list;

        item = UI.Utils.findControl(e.target, 'item-list-item');
        if (item) {
            list = UI.Utils.findControl(item, 'item-list');
            if (list) {
                setSelection(list, item);
            }
        }
    });

    // The public API
    return {
        addItem: function (list, label, value, htmlContent) {
            var elem;
            if (!htmlContent) {
                label = UI.Utils.htmlEncode(label);
            }
            elem = UI.Utils.createElem({
                tag: 'li',
                attrs: {
                    'data-ui-type': 'item-list-item',
                    'data-value': value
                },
                html: label
            });
            list.appendChild(elem);
            return elem;
        },
        clear: function (list) {
            setSelection(list, null);
            UI.Utils.emptyElem(list);
        },
        getSelection: getSelection,
        getSelectionValue: getSelectionValue
    };
}());
