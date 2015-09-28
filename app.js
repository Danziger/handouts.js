var fs = require('fs');
var fileStreamRotator = require('file-stream-rotator');
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var swig = require('swig');
var methodOverride = require('method-override');
var session = require('express-session');

var formater = require('./libs/formater');

var routes = require('./routes/index');

var app = express();





// LOG:

var logDirectory = path.join(__dirname, 'log');

// Ensure log directory exists
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);

var logStream = fileStreamRotator.getStream({
  filename: path.join(logDirectory, 'log-%DATE%.log'),
  frequency: 'daily',
  verbose: true,
  date_format: 'YYYY.MM.DD'
});





// TEMPLATE ENGINE:

// view engine setup
//app.set('views', path.join(__dirname, 'views'));
//app.set('view engine', 'ejs');

app.set('view engine', 'html'); // Set .html as the default extension...
app.set('views', __dirname + '/views'); // ...tell Express where are these html files...
app.engine('.html', swig.renderFile); // ...assign the swig engine to .html files

// Swig will cache templates for you, but you can disable
// that and use Express's caching instead, if you like:
app.set('view cache', false);
// To disable Swig's cache, do the following:
swig.setDefaults({ cache: false });
// NOTE: You should always cache templates in a production environment.
// Don't leave both of these to `false` in production!





// OTHER MIDDLEWARES:

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(methodOverride('_method', {methods: ['GET', 'POST']}));
app.use(logger('dev', {stream: logStream}));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser('your-cookies-secret-here'));
app.use(session({
  secret: "your-cookies-secret-here",
  resave: true,
  saveUninitialized: true,
  cookie: {
    secure: false, // Elsewhere, it will only work on HTTPS!
    maxAge: 24*60*60*1000
  }
}));





// LOCALS: app.locals (global to all views):

app.locals = {
  title: "Application Title",
  formater: formater
};





// ROUTERS:

app.use('/', routes);





// ERROR HANDLERS:

// TO-DO: Put that in the handouts controller too.

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});





module.exports = app;