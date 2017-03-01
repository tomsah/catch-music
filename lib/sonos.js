/**
 * Handles connecting to Sonos and listening to events
 * Uses: https://github.com/bencevans/node-sonos
 */
const sonosApi = require('node-sonos');
const Listener = require('node-sonos/lib/events/listener');

// Get search instance
const search = sonosApi.search();

// This wraps some core functions from node-sonos
const catchSonos = {
  /**
   * Connect to a Sonos zone
   * Will setup an event listener which can be hooked into with catchSons.on()
   * @param  {String}   zoneName
   * @param  {Function} cb
   */
  connect(zoneName, cb) {
    // Search for available devices
    search.on('DeviceAvailable', (device, model) => {
      // Gets attributes (this includes public name we we check against zoneName)
      device.getZoneAttrs((err, attrs) => {
        // Check for errors
        if (err) {
          return cb(err);
        }

        if (attrs.CurrentZoneName === zoneName) {
          // If we have a match, setup machine instance which will expose
          // all the node-sonos methods
          this.machine = new sonosApi.Sonos(device.host, device.port);
          // Setup a listener which will hook into broadcasted events
          this.eventListener = new Listener(this.machine, {
            interface: 'public'
          });

          // Stop search
          search.destroy();
          // Invoke callback #pow!
          cb(null, attrs);
        }
      });
    });
  },
  /**
   * Attches event listener and invokes callback on event
   * @param  {String}   event
   * @param  {Function} cb
   */
  on(event, cb) {
    // Check the event lister is setup from connect call
    if (! ('eventListener' in this)) {
      return cb('No eventListener');
    }

    // Bootstrap event listener accordingly
    this.eventListener.listen((err) => {
      if (err) {
        return cb(err);
      }

      // More info: https://github.com/bencevans/node-sonos/blob/master/examples/transportEvent.js
      this.eventListener.addService('/MediaRenderer/AVTransport/Event', (err) => {
        if (err) {
          cb(err);
        }
      });

      // Finally attach event we care about from catchSonos.on()
      this.eventListener.on(event, cb);
    });
  }
};

module.exports = catchSonos;
