/* global UI */

UI.PropertyList = (function() {

    'use strict';

    var RE_ALPHA_CHARS = /[^a-z]/gi,
        RE_NUMBERIC_CHARS = /[^0-9.]/g;

    /**
     * Creates a DOM tree for a property element
     */
    function createProperty(name) {
        return UI.Utils.createElem({
            tag: 'li',
            attrs: {
                'data-key': name,
                'class': 'property property--collapsed'
            },
            children: [
                {
                    tag: 'span',
                    text: name,
                    attrs: {
                        'class': 'property__name'
                    }
                },
                {
                    tag: 'span',
                    attrs: {
                        'class': 'property__value'
                    }
                }
            ]
        });
    }

    /**
     * Creates a DOM tree for a opener element
     */
    function createOpener() {
        return UI.Utils.createElem({
            tag: 'span',
            attrs: {
                'class': 'property__opener'
            }
        });
    }

    /**
     * Creates a DOM tree for complex property values
     */
    function createChildren() {
        return UI.Utils.createElem({
            tag: 'ul',
            attrs: {
                'class': 'property-list property'
            }
        });
    }

    /**
     * Compares two alphanumeric values 
     *
     * returns:
     *   0   if they are identical
     *   1   if a is greater than b 
     *   -1  if a is less than b
     */
    function alphaNumericSort(a, b) {
        var aKey, bKey;

        a = a.toString();
        b = b.toString();    
        aKey = a.replace(RE_ALPHA_CHARS, '');
        bKey = b.replace(RE_ALPHA_CHARS, '');
        if (aKey === bKey) {
            aKey = parseFloat(a.replace(RE_NUMBERIC_CHARS, ''));
            bKey = parseFloat(b.replace(RE_NUMBERIC_CHARS, ''));
        }
        return aKey === bKey ? 0 : aKey > bKey ? 1 : -1;
    }

    /**
     * Gather up DOM elements for a given property 
     */
    function getPropertyElements(propertyElement) {
        var nextElement = propertyElement.nextElementSibling,
            elements = {
                property: propertyElement,
                key: propertyElement.firstChild,
                value: propertyElement.lastChild
            };

        if (nextElement && nextElement.tagName === 'UL') {
            elements.children = nextElement;
            elements.opener = propertyElement.children[1];
        }
        return elements;
    }

    /**
     * Find a property by its key name in the given context
     */
    function getPropertyByName(context, key) {
        var children = context.children,
            c;

        for (c=0; c<children.length; c++) {
            if (children[c].dataset.key === key) {
                return children[c];
            }
        }
    }

    /**
     * Select all property elements for a given context
     */
    function getPropertyNames(context) {
        var props = [],
            children = context.children,
            c;

        for (c=0; c<children.length; c++) {
            if (children[c].dataset.key) {
                props.push(children[c].dataset.key);
            }
        }
        return props;
    }

    /**
     * Sets one or more properties for a given context.
     *
     * Existing properties that don't appear in the new state
     * are hidden rather than being destroyed so their state is
     * preserved if they are added again later.
     */
    function setProperties(context, properties) {
        var oldProps = getPropertyNames(context),
            newProps = [];

        if (properties) {
            newProps = Object.keys(properties);
        }

        // Remove existing properties
        oldProps.forEach(function (prop) {
            if (newProps.indexOf(prop) === -1) {
                getPropertyByName(context, prop).setAttribute('hidden', 'hidden');
            }
        });

        if (properties) {
            Object.keys(properties).forEach(function (key) {
                setProperty(context, key, properties[key]);
            });
        }
    }

    /**
     * Sets a single property in the given context.
     */
    function setProperty(context, key, value) {
        var elements, property, propertyClassName, refNode, c;

        property = getPropertyByName(context, key);

        if (!property) {
            property = createProperty(key);

            // Insert this property in alpha-numeric order
            for (c = 0; c < context.children.length; c++) {
                if (!context.children[c].dataset.key) {
                    continue;
                }
                if (alphaNumericSort(key, context.children[c].dataset.key) <= 0) {
                    refNode = context.children[c];
                    break;
                }
            }
            context.insertBefore(property, refNode);
        }

        elements = getPropertyElements(property);

        // Is the new value a complex object (array or object)?
        if (value && typeof value === 'object') {
            if (!elements.children) {
                elements.children = createChildren();
                elements.opener = createOpener();
                context.insertBefore(elements.children, property.nextElementSibling);
                elements.property.insertBefore(elements.opener, elements.key);
            }
            setProperties(elements.children, value);
        }

        if (elements.property.hasAttribute('hidden')) {
            elements.property.removeAttribute('hidden');
        }

        propertyClassName = 'property property--' + typeof value;

        if (elements.property.classList.contains('property--collapsed')) {
            propertyClassName += ' property--collapsed';
        }

        elements.property.className = propertyClassName;

        // convert the value to a string
        if (value !== null && value !== undefined) {
            value = value.toString();
        }

        // update the value if it changed
        if (elements.value.textContent !== value) {
            elements.value.textContent = value;
        }
    }

    // Event handling
    document.addEventListener('click', function (e) {
        var t = e.target,
            c = t.classList;

        if (c.contains('property__opener')) {
            c = e.target.parentNode.classList;
            c.toggle('property--collapsed');
            e.preventDefault();
        }
    });

    // The public API
    return {
        setProperty: function(list, key, value) {
            setProperty(list, key, value);
        },
        setProperties: function(list, properties) {
            setProperties(list, properties);
        }
    };
}());