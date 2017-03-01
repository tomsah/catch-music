const assert = require('assert');
const express = require('express');
const catchSonos = require('./lib/sonos');
const catchSlackBot = require('./lib/slack-bot');

const app = express();
const SONOS_NAME = 'Catch - CS';

let appPort = 4000;
let lastSong = {};

// Setup port based on environment if available
app.set('port', process.env.PORT || appPort);
appPort = app.get('port');

// Setup react views
app.set('views', __dirname + '/views');
app.set('view engine', 'jsx');
app.engine('jsx', require('express-react-views').createEngine());

// Setup static assets
app.use(express.static('public'));

// Connect to sonos and Slack
// This will run a couple of concurnet processes.
// Any error is just going to throw right now, but we can catch these later on...
catchSonos.connect(SONOS_NAME, (err, data) => {
  // Throws error when trying to connect.  Maybe Sonos is off, who knows?
  assert.equal(null, err);

  // Connect to Slack RTM websocket
  catchSlackBot.connect((err) => {
    // Check for errors
    assert.equal(null, err);

    // Watch for serviceEvents
    catchSonos.on('serviceEvent', () => {
      // Get the current track when the event is fired and post it to slack
      catchSonos.machine.currentTrack((err, data) => {
        assert.equal(null, err);

        // Post raw data from sonos client
        catchSlackBot.postSong(data);

        // Save last song
        lastSong = data;
      });
    });
  });
});

// Hello world
app.get('/', (req, res) => {
  res.render('routes/index', {
    head: {
      title: 'Hello World!'
    }
  });
});

// Example of retrieving data from process runtim
// Ideally we can hook this up to a websocker
app.get('/last-played', (req, res) => {
  res.render('routes/last-played', {
    head: {
      title: `Last Played: ${lastSong.title} by ${lastSong.artist}`
    },
    song: lastSong
  });
});

app.listen(app.get('port'), () => {
  console.log(`Express server started at localhost:${appPort}`);
});
