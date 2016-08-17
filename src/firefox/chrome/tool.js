'use strict';

const { classes: Cc, interfaces: Ci, utils: Cu, results: Cr } = Components;

const STRINGS_URI = 'chrome://gadebugger/locale/strings.properties';

const EVENTS = {
  NETWORK_EVENT: 'networkEvent',
  NETWORK_EVENT_UPDATE: 'networkEventUpdate',
  BEACONMONITOR_STARTED: 'GADebugger:BeaconMonitorStarted',
  BEACONMONITOR_STOPPED: 'GADebugger:BeaconMonitorStopped',
  BEACONMONITOR_BEACON: 'GADebugger:BeaconMonitorBeacon'
};

const RE_ALPHA_CHARS = /[^a-z]/gi;
const RE_NUMBERIC_CHARS = /[^0-9.]/g;

Cu.import('chrome://gadebugger/content/resourceLoader.js');

const appVersion = ResourceLoader.getAppMajorVersion();
const {Heritage, WidgetMethods, ViewHelpers} = ResourceLoader.require('devtools/client/shared/widgets/view-helpers');
const {SideMenuWidget} = ResourceLoader.require('resource://devtools/client/shared/widgets/SideMenuWidget.jsm');
const {VariablesView} = ResourceLoader.require('resource://devtools/client/shared/widgets/VariablesView.jsm');
const {LocalizationHelper} = ResourceLoader.require('devtools/client/shared/l10n');
const EventEmitter = ResourceLoader.require('devtools/shared/event-emitter');
const promise = ResourceLoader.require('promise');

ResourceLoader.loadStyleSheet('chrome://devtools/skin/common.css', document);
ResourceLoader.loadStyleSheet('chrome://devtools/skin/splitview.css', document);
ResourceLoader.loadStyleSheet('chrome://devtools/skin/widgets.css', document);
ResourceLoader.loadStyleSheet('chrome://devtools/content/shared/widgets/widgets.css', document);

function startup(toolbox, target) {
    TrackerListView.initialize();
    TrackerBeaconsView.initialize();
    BeaconPropertiesView.initialize();
    ToolbarView.initialize(target.client);
    BeaconMonitor.initialize(target.client, target.form);
    return promise.resolve();
}

function shutdown() {
    BeaconMonitor.stop();
    BeaconMonitor.destroy();
    TrackerListView.destroy();
    BeaconPropertiesView.destroy();
    ToolbarView.destroy();
    return promise.resolve();
}


let BeaconMonitor = {
    initialize: function(client, tabGrip) {
        let aClient = client;
        let aTabGrip = tabGrip;
        this.client = client;
        this.tabGrip = tabGrip;

        aClient.attachTab(aTabGrip.actor, (aResponse, aTabClient) => {
            aClient.attachConsole(aTabGrip.consoleActor, ['NetworkActivity'], (aResponse, aWebConsoleClient) => {
                if (aWebConsoleClient) {
                    this.webConsoleClient = aWebConsoleClient;
                }
            });
        });

        this._onNetworkEvent = this._onNetworkEvent.bind(this);
        this._onNetworkEventUpdate = this._onNetworkEventUpdate.bind(this);
    },
    destroy: function() {
        this.client = null;
        this.webConsoleClient = null;
    },
    start: function() {
        if (!this.capturing) {
            this._activeRequests = {};
            this.client.addListener(EVENTS.NETWORK_EVENT, this._onNetworkEvent);
            this.client.addListener(EVENTS.NETWORK_EVENT_UPDATE, this._onNetworkEventUpdate);
            this._recording = true;
            window.emit(EVENTS.BEACONMONITOR_STARTED);
        }
    },
    stop: function() {
        if (this.capturing) {
            this.client.removeListener(EVENTS.NETWORK_EVENT, this._onNetworkEvent);
            this.client.removeListener(EVENTS.NETWORK_EVENT_UPDATE, this._onNetworkEventUpdate);
            this._activeRequests = {};
            this._recording = false;
            window.emit(EVENTS.BEACONMONITOR_STOPPED);
        }
    },
    get capturing() {
        return this._recording;
    },
    /**
     * The `networkEvent` message type handler.
     *
     * Arguments:
     *   aType     string   Message type
     *   aPacket   object   The network request information
     */
    _onNetworkEvent: function(aType, aPacket) {
        var eventActor = aPacket.eventActor;

        if (GACore.isBeaconUrl(eventActor.url)) {
            let request = {
                method: eventActor.method,
                url: eventActor.url
            };

            // if this is a GET request we can log the beacon now
            if (request.method === 'GET') {
                this._onNetworkBeaconRequest(request);
            }
            // for POST requests we need to wait for the `networkEventUpdate` event
            else if (request.method === 'POST') {
                this._activeRequests[eventActor.actor] = request;
            }
        }
    },
    /**
     * The `networkEventUpdate` message type handler.
     *
     * Arguments:
     *   aType     string   Message type
     *   aPacket   object   The network request information
     */
    _onNetworkEventUpdate: function(aType, aPacket) {
        var activeRequest = this._activeRequests[aPacket.from];
        if (activeRequest) {
            if (aPacket.updateType === 'requestPostData') {
                this.webConsoleClient.getRequestPostData(aPacket.from, function (aResponse) {
                    activeRequest.postData = aResponse.postData.text;
                    this._onNetworkBeaconRequest(activeRequest);
                    delete this._activeRequests[aPacket.from];
                }.bind(this));
            }
        }
    },
    /**
     * The `networkBeaconRequest` handler.
     *
     * Called when a network request is determined to be a valid
     * GA beacon.
     *
     * Arguments:
     *   request   object   The request object
     */
    _onNetworkBeaconRequest: function(request) {
        var url = request.url;
        var beacon;

        // if this is a POST it was either sent using the `xhr`
        // or `beacon` transport. For these requests we append
        // the post body to the url as a querystring.
        if (request.method === 'POST') {
            url += '?' + request.postData;
        }

        beacon = GACore.parseBeacon(url);
        if (beacon) {
            window.emit(EVENTS.BEACONMONITOR_BEACON, beacon);
            if (!TrackerListView.hasTracker(beacon.account)) {
                TrackerListView.addTracker(beacon.account, beacon.documentHostname);
            }
            TrackerListView.addBeacon(beacon.account, beacon);
        }
    },
    _recording: false
};

let ToolbarView = {
    initialize: function(client) {
        this._captureToggleButton = $('#capture-button');
        this._clearButton = $('#clear-button');
        this._preserveLogCheckbox = $('#preserve-log');

        // Prior to v48, use buttons text labels instead of icons. Altough pre-48
        // supported icons, the icon colouring requirements were different
        if (appVersion < 50) {
            this._captureToggleButton.classList.remove('record-button');
            this._clearButton.classList.remove('devtools-clear-icon');
            this._clearButton.setAttribute('label', L10N.getStr('clearLabel'));
       }

        this._clearButton.setAttribute('tooltiptext', L10N.getStr('clearTooltip'));
        this._preserveLogCheckbox.setAttribute('label', L10N.getStr('preserveLogLabel'));

        this._onCaptureTogglePressed = this._onCaptureTogglePressed.bind(this);
        this._onClearPressed = this._onClearPressed.bind(this);
        this._onTabNavigated = this._onTabNavigated.bind(this);

        this._captureToggleButton.addEventListener('click', this._onCaptureTogglePressed, false);
        this._clearButton.addEventListener('click', this._onClearPressed, false);

        window.on(EVENTS.BEACONMONITOR_STARTED, this._onBeaconMonitorStart.bind(this));
        window.on(EVENTS.BEACONMONITOR_STOPPED, this._onBeaconMonitorStop.bind(this));

        client.addListener('tabNavigated', this._onTabNavigated);

        this._onBeaconMonitorStop();
    },
    destroy: function() {
        this._captureToggleButton.removeEventListener('click', this._onCaptureTogglePressed, false);
        this._clearButton.removeEventListener('click', this._onClearPressed, false);
    },
    _onTabNavigated: function(aEvent, aPacket) {
        if (aPacket.state === 'start' && !this._preserveLogCheckbox.checked) {
            this._onClearPressed();
        }
    },
    _onCaptureTogglePressed: function() {
        if (BeaconMonitor.capturing) {
            BeaconMonitor.stop();
        } else {
            BeaconMonitor.start();
        }
    },
    _onClearPressed: function() {
        TrackerListView.empty();
        TrackerBeaconsView.empty();
        BeaconPropertiesView.hide();
    },
    _onBeaconMonitorStart: function() {
        if (appVersion < 50) {
            this._captureToggleButton.setAttribute('label', L10N.getStr('stopLabel'));
        }
        this._captureToggleButton.setAttribute('tooltiptext', L10N.getStr('stopTooltip'));
        this._captureToggleButton.setAttribute('checked', 'true');
    },
    _onBeaconMonitorStop: function() {
        if (appVersion < 50) {
            this._captureToggleButton.setAttribute('label', L10N.getStr('startLabel'));
        }
        this._captureToggleButton.setAttribute('tooltiptext', L10N.getStr('startTooltip'));
        this._captureToggleButton.removeAttribute('checked');
    }
};

let TrackerListView = Heritage.extend(WidgetMethods, {
    initialize: function() {
        this.widget = new SideMenuWidget($('#trackers-list'), {
            showArrows: true,
            showItemCheckboxes: false,
            alignedValues: true
        });

        this._onTrackerSelect = this._onTrackerSelect.bind(this);

        this.widget.addEventListener('select', this._onTrackerSelect, false);
    },
    destroy: function() {
        this.widget.removeEventListener("select", this._onTrackerSelect, false);
    },
    addTracker: function(account, domain) {
        if (this.hasTracker(account)) {
            return;
        }

        var itemNode = document.createElement('vbox');
        var accountNode = document.createElement('label');
        var domainNode = document.createElement('label');
        var item;

        itemNode.className = 'tracker';
        accountNode.className = 'tracker__account';
        domainNode.className = 'tracker__domain';
        
        accountNode.setAttribute('value', account);
        domainNode.setAttribute('value', domain);

        itemNode.appendChild(accountNode);
        itemNode.appendChild(domainNode);

        item = this.push([itemNode], {
            index: -1,
            attachment: {
                account: account,
                beacons: []
            }
        });

        if (!this.selectedItem) {
            this.selectedIndex = 0;
        }

        return this.getItemAtIndex(item);

    },
    hasTracker: function(account) {
        return !!this.attachments.filter(e => e.account === account).length;    
    },
    _onTrackerSelect: function(e) {
        // Store the current selection index so we can try to restore it
        let lastIndex = TrackerBeaconsView.selectedIndex;

        // Update the beacon list 
        TrackerBeaconsView.setBeacons(e.detail.attachment.beacons);

        // Restore the previous selection
        TrackerBeaconsView.selectedIndex = lastIndex;

        // Make sure we always have a selection
        if (!TrackerBeaconsView.selectedItem) {
            TrackerBeaconsView.selectedIndex = 0;
        }
    },
    getTrackerById: function(account) {
        return this.getItemForAttachment(function (e) {
            return e.account === account;
        });
    },
    addBeacon: function(account, beacon) {
        let item = this.getTrackerById(account);

        if (item) {
            item.attachment.beacons.push(beacon);
            if (item === this.selectedItem) {
                TrackerBeaconsView.addBeacon(beacon);
            }           
        }
    }
});


let TrackerBeaconsView = Heritage.extend(WidgetMethods, {
    initialize: function() {
        this.widget = new SideMenuWidget($('#tracker-beacons'));

        this._onBeaconSelect = this._onBeaconSelect.bind(this);

        this.widget.addEventListener('select', this._onBeaconSelect, false);

    },
    destroy: function() {
        this.widget.removeEventListener("select", this._onBeaconSelect, false);
    },
    addBeacon: function(beacon) {
        let itemNode = document.createElement('label'),
            item;

        itemNode.setAttribute('value', GACore.createBeaconHint(beacon));
        item = this.push([itemNode], {
            index: -1,
            attachment: {
                beacon: beacon
            }
        });
        item.target.classList.add('beacon', 'beacon--' + beacon.type);

        if (!this.selectedItem) {
            this.selectedIndex = 0;
        }
    },
    setBeacons: function(beacons) {
        this.empty();
        for (let beacon of beacons) {
            this.addBeacon(beacon);
        }
    },
    _onBeaconSelect: function(e) {
        BeaconPropertiesView.update(e.detail.attachment.beacon);
    }
});


let BeaconPropertiesView = {
    initialize: function() {
        this.pane = $('#beacon-properties');
        this.hide();

        this.widget = new VariablesView($('#all-headers'));
        this.trackerProps = this.widget.addScope(L10N.getStr('trackerInfoLabel'));
        this.clientProps = this.widget.addScope(L10N.getStr('clientInfoLabel'));
        this.documentProps = this.widget.addScope(L10N.getStr('documentInfoLabel'));
        this.eventProps = this.widget.addScope(L10N.getStr('eventInfoLabel'));
        this.customVarProps = this.widget.addScope(L10N.getStr('customVarsLabel'));
        this.customDimensionsProps = this.widget.addScope(L10N.getStr('customDimensionsLabel'));
        this.customMetricsProps = this.widget.addScope(L10N.getStr('customMetricsLabel'));
        this.timingProps = this.widget.addScope(L10N.getStr('userTimingsLabel'));
        this.campaignProps = this.widget.addScope(L10N.getStr('campaignDataLabel'));
        this.transactionProps = this.widget.addScope(L10N.getStr('transactionPropsLabel'));
        this.transactionItemProps = this.widget.addScope(L10N.getStr('transactionItemPropsLabel'));
        this.contentGroupProps = this.widget.addScope(L10N.getStr('contentGroupsLabel'));
        this.socialProps = this.widget.addScope(L10N.getStr('socialPropsLabel'));

        // Initialize the view with all scopes expanded
        for (let scope of this.widget) {
            scope.expand();
        }
    },
    destroy: function() {
        this.widget.empty();
    },
    /**
     * Hide this pane
     */
    hide: function() {
        ViewHelpers.togglePane({visible: false}, this.pane);    
    },
    /**
     * Show this pane
     */
    show: function() {
        ViewHelpers.togglePane({visible: true}, this.pane);       
    },
    /**
     * Update the view with the specified beacon
     */
    update: function(beacon) {

        this.setProperties(this.trackerProps, {
            trackerType: beacon.trackingMethod,
            trackerVersion: beacon.version,
            trackerAccount: beacon.account,
            clientId: beacon.clientId,
            visitorId: beacon.visitorId,
            sessionId: beacon.sessionId
        });

        this.setProperties(this.clientProps, {
            screenSize: beacon.screen,
            viewportSize: beacon.viewport,
            colors: beacon.colorDepth,
            flashVersion: beacon.flashVersion,
            javaEnabled: beacon.javaEnabled
        });

        this.setProperties(this.documentProps, {
            documentTitle: beacon.documentTitle,
            documentUrl: beacon.documentUrl,
            documentPath: beacon.documentPath,
            referrer: beacon.referrer,
            characterSet: beacon.charset,
            language: beacon.language,
            screenName: beacon.screenName
        });

        this.setProperties(this.transactionProps, beacon.transaction && {
            orderId: beacon.transaction.id,
            affiliation: beacon.transaction.affiliation,
            revenue: beacon.transaction.revenue,
            shipping: beacon.transaction.shipping,
            tax: beacon.transaction.tax,
            currency: beacon.transaction.currency
        });

        this.setProperties(this.transactionItemProps, beacon.transactionItem && {
            orderId: beacon.transactionItem.transactionId,
            sku: beacon.transactionItem.sku,
            productName: beacon.transactionItem.name,
            category: beacon.transactionItem.category,
            price: beacon.transactionItem.price,
            quantity: beacon.transactionItem.quantity,
            currency: beacon.transactionItem.currency
        });

        if (beacon.customVars) {
            let customVars = {};
            beacon.customVars.forEach(function (customVar) {
                customVars[customVar.slot] = customVar;
            });
            this.setProperties(this.customVarProps, customVars, 'customVarsSlot');
        } else {
            this.setProperties(this.customVarProps, null);
        }
        
        this.setProperties(this.eventProps, beacon.event);
        this.setProperties(this.timingProps, beacon.userTimings);
        this.setProperties(this.socialProps, beacon.social);
        this.setProperties(this.customDimensionsProps, beacon.customDimensions, 'customDimensionsSlot');
        this.setProperties(this.customMetricsProps, beacon.customMetrics, 'customMetricsSlot');
        this.setProperties(this.contentGroupProps, beacon.contentGroups, 'contentGroupsSlot');
        this.setProperties(this.campaignProps, beacon.campaignData);

        this.show();
    },

    /**
     * Set the property view data
     */
    setProperties: function(scope, properties, label) {
        var viewItems = {},
            viewState = {},
            viewDirty = false,
            hasProperties = false;

        if (properties) {

            // Convert our raw object properties to nice names
            for (let property of Object.keys(properties)) {
                if (properties[property] !== undefined) {
                    let itemName;

                    if (label) {
                        itemName = L10N.getFormatStr(label, property);
                    } else {
                        itemName = L10N.getStr(property);
                    }

                    // if this property doesn't exist in the current
                    // scope we need to empty the entire scope and
                    // add everything again to ensure properties stay
                    // in the indented order.
                    if (!scope.get(itemName)) {
                        viewDirty = true;
                    }

                    viewItems[itemName] = properties[property];
                }
            }

            // Sort the property names ready for population
            let viewNames = Object.keys(viewItems).sort(this._sort);

            // If the list needs emptying or if a property isn't needed...
            for (let [currentName, item] of scope) {
                if (viewDirty || viewNames.indexOf(currentName) === -1) {
                    if (item.expanded) {
                        viewState[currentName] = true;
                    }
                    item.remove();
                }
            }

            // Populate the list
            for (let name of viewNames) {
                let value = viewItems[name];
                let item = scope.get(name) || scope.addItem(name);

                if (typeof value === 'object') {
                    item.showArrow();
                    item.setGrip({
                        type: 'object',
                        class: value.toString()
                    });
                    if (viewState[name]) {
                        item.expand();
                    }
                    if (this.setProperties(item, value)) {
                        hasProperties = true;
                    }
                } else {
                    item.setGrip(value);
                    hasProperties = true;
                }
            }
        }

        // Only show the scope if it has content
        scope.visible = hasProperties;

        return hasProperties;

    },

    /**
     * Property sorting
     */
    _sort: function (a, b) {
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
};

/**
 * Localization convenience methods.
 */
let L10N = new LocalizationHelper(STRINGS_URI);

/**
 * Convenient way of emitting events from the panel window.
 */
EventEmitter.decorate(this);

/**
 * DOM query helper.
 */
function $(selector, target = document) {
    return target.querySelector(selector);
}
