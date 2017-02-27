let express = require('express');
let app = express();
let APP_PORT = 4000;

// Setup port based on environment if available
app.set('port', process.env.PORT || APP_PORT);
APP_PORT = app.get('port');

// Setup react views
app.set('views', __dirname + '/views');
app.set('view engine', 'jsx');
app.engine('jsx', require('express-react-views').createEngine());

// Setup static assets
app.use(express.static('public'))

// Hello world
app.get('/', function(req, res) {
  res.render('routes/index', {
    head: {
      title: 'Hello World!'
    }
  });
});

app.listen(app.get('port'), () => {
  console.log(`Express server started at localhost:${APP_PORT}`);
});
