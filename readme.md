# Google Analytics Debugger Extension

![Google Analytics Debugger in Chrome (above) and Firefox (below)](screengrab.png)

Google Analytics Debugger is a devtools extension for Chrome and Firefox that exposes tracking beacon data to developers so they can test their analytics implementations. The extension will capture tracking beacons from Classic/Traditional Analytics and Universal Analytics.

Google Analytics Debugger will log the following interactions and data:

* Page views
* Events
* E-commerce transactions
* User timings
* Social interactions
* Custom variables
* Custom dimensions
* Custom metrics
* Content groups
* Campaign tracking


## Prerequisites  

### Requirements

* NodeJS / NPM
* Grunt CLI


### Setup

    npm install


## Building

The easiest way to get started is to simply run:

    grunt

This will build the core, the browser extensions and start a watch task. If you want to build components or extensions individually you can use:

    grunt core                   // builds the core
    grunt core chrome            // builds the chrome extension (requires core)
    grunt core firefox           // builds the firefox extension (requires core)


## Installing the extension for development

### Chrome

First, make sure you've built the chrome extension. Browse to [chrome://extensions](chrome://extensions/), tick the **'Developer mode'** option, click **'Load unpacked extension'** and select the `build/chrome` folder. If all goes well, when you open/restart devtools you should see a **'GA Debugger'** panel.

If you modify the core or chrome source code you'll need to rebuild the extension (the watch task will do this for you) and then restart devtools to see your changes.

### Firefox

First, make sure you've built the Firefox add-on. Browse to your Firefox profile, find the extensions folder and create a new text file named `gadebugger@browserextensions.keithclark.co.uk`, paste the path to the Firefox build directoy and restart firefox.

If you modify the core or add-on source code you'll need to rebuild the extension (the watch task will do this for you) and then restart devtools to see your changes.


## Building distributable extensions

The `dist` task will package each extension into its distributable format, ready to be installed in the browser. You can run this task (once you have build the extensions) using:

	grunt dist                    // create distributable extensions


## Notes

The GA debugger repository contains GACore and the Chrome devtools extension. GACore is a library for inspecting Google Analytics tracking beacons and is used by all browser extensions. GACore can also stand alone if required.
