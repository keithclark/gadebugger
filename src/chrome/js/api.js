/* global GACore, UI, chrome */
/* exported GADebuggerAPI */

var GADebuggerAPI = (function() {

    'use strict';

    var trackerObjects = [],
        capturing = false,
        elements = {
            beaconPanel: '#tracker-data',
            propsPanel: '#beacon-props',
            trackerList: '#tracker-list > ul',
            trackerBeaconList: '#tracker-data > ul',
            trackerProps: '#tracker-properties',
            clientProps: '#client-properties',
            documentProps: '#document-properties',
            eventProps: '#event-properties',
            customVarProps: '#custom-var-properties',
            customDimensionsProps: '#custom-dimensions-properties',
            customMetricsProps: '#custom-metrics-properties',
            campaignProps: '#campaign-properties',
            timingProps: '#timing-properties',
            transactionProps: '#transaction-properties',
            transactionItemProps: '#transaction-item-properties',
            socialProps: '#social-properties',
            experimentProps: '#experiment-properties',
            contentGroupProps: '#content-group-properties',
            captureButton: '#capture-button',
            clearButton: '#clear-button',
            preserveLog: '#preserve-log',
        };

    Object.keys(elements).forEach(function (element) {
        elements[element] = document.querySelector(elements[element]);
    });

    elements.beaconPanel.removeChild(elements.trackerBeaconList);
    elements.propsPanel.style.display = 'none';

    elements.clearButton.addEventListener('click', clearTrackers);

    elements.captureButton.addEventListener('toggle', function (e) {
        capturing = e.detail;
        if (capturing) {
            chrome.devtools.network.onRequestFinished.addListener(requestHandler);
        } else {
            chrome.devtools.network.onRequestFinished.removeListener(requestHandler);
        }
    });

    chrome.devtools.network.onNavigated.addListener(function() {
        if (!elements.preserveLog.checked) {
            clearTrackers();
        }
    });

    function requestHandler(request) {
        if (request.response.status === 200) {
            process(request.request);
        }
    }

    document.addEventListener('change', function (e) {
        var selectedTracker, tracker, beacon, beaconPanel;

        if (e.target.dataset.uiType !== 'item-list') {
            return;
        }

        selectedTracker = UI.ItemList.getSelectionValue(elements.trackerList);
        beaconPanel = elements.beaconPanel;

        if (selectedTracker) {
            tracker = getTrackerByAccount(selectedTracker);
            if (tracker) {
                // did the user change the active tracker?
                if (e.target === elements.trackerList) {
                    while (beaconPanel.hasChildNodes()) {
                        beaconPanel.removeChild(beaconPanel.firstChild);
                    }
                    beaconPanel.appendChild(tracker.list);
                }
                beacon = UI.ItemList.getSelectionValue(tracker.list);
            }
        }
        if (beacon) {
            updatePropertiesView(GACore.parseBeacon(beacon));
            elements.propsPanel.style.display = '';
        } else {
            elements.propsPanel.style.display = 'none';
        }
    });


    function clearTrackers() {
        trackerObjects = [];
        while (elements.beaconPanel.hasChildNodes()) {
            elements.beaconPanel.removeChild(elements.beaconPanel.firstChild);
        }
        UI.ItemList.clear(elements.trackerList);
    }


    function getTrackerByAccount(account) {
        return trackerObjects.filter(function (tracker) {
            return tracker.account === account;
        })[0];
    }


    function process(request) {
        var url = request.url,
            beacon, tracker, item, refNode;

        if (GACore.isBeaconUrl(url)) {

            if (request.method === 'POST') {
                url += request.queryString.length ? '&' : '?';
                url += request.postData.text;
            }

            beacon = GACore.parseBeacon(url);

            if (beacon) {
                tracker = getTrackerByAccount(beacon.account);

                // create a tracker list item for this beacon
                if (!tracker) {
                    tracker = {
                        account: beacon.account,
                        list: elements.trackerBeaconList.cloneNode(true)
                    };
                    UI.ItemList.addItem(
                        elements.trackerList,
                        tracker.account + '<i>' + beacon.documentHostname + '</i>',
                        tracker.account,
                        true
                    );
                    trackerObjects.push(tracker);
                }

                // add the beacon to the trackers beacon list
                item = UI.ItemList.addItem(
                    tracker.list,
                    beacon.type + ' - ' + GACore.createBeaconHint(beacon),
                    url
                );

                item.className = 'beacon beacon--' + beacon.type;

                // ensure transaction items are grouped
                if (beacon.type === 'item') {
                    refNode = tracker.list.querySelector('[tid="' + beacon.transactionItem.transactionId + '"]');
                    if (refNode) {
                        refNode = refNode.nextElementSibling;
                    }
                    tracker.list.insertBefore(item, refNode);
                    item.setAttribute('tid', beacon.transactionItem.transactionId);
                }

                // ensure the transaction header is above any transaction items
                if (beacon.type === 'transaction') {
                    tracker.list.insertBefore(item, tracker.list.querySelector('[tid="' + beacon.transaction.id + '"]'));
                }
            }
        }
    }

    function setProperties(propertyList, props) {
        var group = propertyList.parentNode.parentNode;

        var hasProps = props && !Object.keys(props).every(function (prop) {
            return props[prop] === undefined;
        });

        if (!hasProps) {
            group.setAttribute('hidden', 'hidden');
        } else {
            group.removeAttribute('hidden');
        }

        UI.PropertyList.setProperties(propertyList, props);
    }


    function updatePropertiesView(beacon) {
        var customVars = {};

        setProperties(elements.trackerProps, {
            'Type': beacon.trackingMethod,
            'Version': beacon.version,
            'Account': beacon.account,
            'Client ID': beacon.clientId,
            'Visitor ID': beacon.visitorId,
            'Session ID': beacon.sessionId
        });

        setProperties(elements.clientProps, {
            'Screen size': beacon.screen,
            'Viewport size': beacon.viewport,
            'Colors': beacon.colorDepth,
            'Flash version': beacon.flashVersion,
            'Java enabled': beacon.javaEnabled
        });

        setProperties(elements.documentProps, {
            'Title': beacon.documentTitle,
            'Url': beacon.documentUrl,
            'Path': beacon.documentPath,
            'Referrer': beacon.referrer,
            'Character set': beacon.charset,
            'Language': beacon.language,
            'Screen name': beacon.screenName
        });

        setProperties(elements.eventProps, beacon.event && {
            'Category': beacon.event.category,
            'Action': beacon.event.action,
            'Label': beacon.event.label,
            'Value': beacon.event.value,
            'Non-interactive': beacon.event.nonInteractive
        });

        setProperties(elements.timingProps, beacon.userTimings && {
            'Category': beacon.userTimings.category,
            'Variable': beacon.userTimings.variable,
            'Value': beacon.userTimings.value,
            'Label': beacon.userTimings.label
        });

        setProperties(elements.transactionProps, beacon.transaction && {
            'Order ID': beacon.transaction.id,
            'Affiliation': beacon.transaction.affiliation,
            'Revenue': beacon.transaction.revenue,
            'Shipping': beacon.transaction.shipping,
            'Tax': beacon.transaction.tax,
            'Currency': beacon.transaction.currency
        });

        setProperties(elements.transactionItemProps, beacon.transactionItem && {
            'Order ID': beacon.transactionItem.transactionId,
            'SKU': beacon.transactionItem.sku,
            'Product name': beacon.transactionItem.name,
            'Category': beacon.transactionItem.category,
            'Price': beacon.transactionItem.price,
            'Quantity': beacon.transactionItem.quantity,
            'Currency': beacon.transactionItem.currency
        });

        setProperties(elements.socialProps, beacon.social && {
            'Network': beacon.social.network,
            'Action': beacon.social.action,
            'Target': beacon.social.target
        });

        setProperties(elements.experimentProps, beacon.experiment && {
            'ID': beacon.experiment.id,
            'Variant': beacon.experiment.variant
        });

        if (beacon.customVars) {
            beacon.customVars.forEach(function (customVar) {
                customVars['Slot ' + customVar.slot] = customVar;
            });
            setProperties(elements.customVarProps, customVars);
        } else {
            setProperties(elements.customVarProps, null);
        }

        setProperties(elements.customDimensionsProps, beacon.customDimensions);
        setProperties(elements.customMetricsProps, beacon.customMetrics);
        setProperties(elements.contentGroupProps, beacon.contentGroups);
        setProperties(elements.campaignProps, beacon.campaignData);
    }

    return {
        process: function(url) {
            return process(url);
        },
        clear: function() {
            return clearTrackers();
        }
    };
}());
