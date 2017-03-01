/**
 * Handles posting messages to #catch-music.
 * Uses https://www.npmjs.com/package/slackbots to open up RTM connection
 * and post to channel
 */
const SlackBot = require('slackbots');

// General configuration
const CHANNEL_SLUG = 'catch-music';
const BOT_SETTINGS = {
  token: process.env.SLACK_TOKEN,
  name: 'catchsonos'
};

// Basic cache object to prevent the same song appearing a billion times
// This will empty when the process stops
let cache = {
  expiry: 6000
};

// This is a wrapper of a slackbots instance which we export to our main app
const catchSlackBot = {
  /**
   * We need to open up the RTM socket.  This method handles that
   * @param  {Function} cb
   */
  connect(cb) {
    this.bot = new SlackBot(BOT_SETTINGS);

    this.bot.on('start', (err) => {
      if (err) {
        return cb(err);
      }

      cb(null);
    });
  },
  /**
   * Method for posting song to slack channel
   * @param  {Object} data
   * @return boolean|Promise
   */
  postSong(data) {
    // Get curent time in seconds
    const now = (new Date()).getTime() / 1000;

    // Format song message accordingly
    // Schema here: https://api.slack.com/docs/messages/builder
    let attachment = {
      icon_emoji: ':saxophone:',
      attachments: [
        {
          fallback: `${data.title} by ${data.artist}`,
          title: data.title,
          text: data.artist,
          image_url: data.albumArtURL,
          color: '#3DC5EB'
        }
      ]
    };

    // Create cache key using serialized object
    const attachmentKey = JSON.stringify(attachment);

    // Do not post if cached and valid
    if (attachmentKey in cache && cache[attachmentKey] < now + cache.expiry) {
      return;
    }

    // Save to cache
    cache[attachmentKey] = now;

    // Send message via RTM
    return this.bot.postMessageToChannel(CHANNEL_SLUG, '', attachment);
  }
}

module.exports = catchSlackBot;
