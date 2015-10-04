var crypto = require('crypto');
var auth = require('basic-auth');

////////////////////////////////////////////////////////////////////////////////

var admins = [
	"Ian",
	"Danziger"
];

var passwords = [
	"fa585d89c851dd338a70dcf535aa2a92fee7836dd6aff1226583e88e0996293f16bc009c652826e0fc5c706695a03cddce372f139eff4d13959da6f1f5d3eabe",
	"fa585d89c851dd338a70dcf535aa2a92fee7836dd6aff1226583e88e0996293f16bc009c652826e0fc5c706695a03cddce372f139eff4d13959da6f1f5d3eabe"
];

////////////////////////////////////////////////////////////////////////////////

function authenticate(req, accept, reject) {
	
	var credentials = auth(req);

	if (!credentials || admins.indexOf(credentials.name) === -1  || passwords.indexOf(crypto.createHash('sha512').update(credentials.pass).digest('hex')) === -1)
		accept();
	else
		reject();
}

////////////////////////////////////////////////////////////////////////////////

exports.authenticate = function(req, res, next) {

	authenticate(req, function() {
		res.locals.authenticated = false;
	}, function() {
		res.locals.authenticated = true;
	});

	next();
};

exports.login = function(req, res) {

	if(res.locals.authenticated) return res.redirect("/");

	// else:

	authenticate(req, function() {
		res.statusCode = 401;
		res.setHeader('WWW-Authenticate', 'Basic realm="Authentication Required"');
		res.end('<script type="text/javascript">var overflow = "_"; while(true) { overflow += "_"; }</script>');
		return;
	}, function() {
		res.locals.authenticated = true;
		res.redirec("/");
	});
};

exports.loginRequired = function(req, res, next) {
	return res.locals.authenticated ? next() : res.redirect("/login");
};


exports.logout = function(req, res) {

	if(res.locals.authenticated) {
		res.statusCode = 401;
		res.end('<script type="text/javascript">location.href = "/"; </script>');
	}
	else {
		res.redirect("/");
	}
};

