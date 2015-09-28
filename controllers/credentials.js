var crypto = require('crypto');
var auth = require('basic-auth');

exports.authenticate = function(req, res, next) {

	var credentials = auth(req);
	var sha512 = crypto.createHash('sha512');

	var admins = [
		"Ian",
		"Danziger"
	];

	var passwords = [
		"fa585d89c851dd338a70dcf535aa2a92fee7836dd6aff1226583e88e0996293f16bc009c652826e0fc5c706695a03cddce372f139eff4d13959da6f1f5d3eabe",
		"fa585d89c851dd338a70dcf535aa2a92fee7836dd6aff1226583e88e0996293f16bc009c652826e0fc5c706695a03cddce372f139eff4d13959da6f1f5d3eabe"
	];

	if (!credentials || admins.indexOf(credentials.name) === -1  || passwords.indexOf(sha512.update(credentials.pass).digest('hex')) === -1)
		res.locals.authenticated = false;
	else 
		res.locals.authenticated = true;

	next();
};

exports.login = function(req, res) {

	if(res.locals.authenticated)
		res.redirect("/");
	else {

		var credentials = auth(req);
		var sha512 = crypto.createHash('sha512');

		var admins = [
			"Ian",
			"Danziger"
		];

		var passwords = [
			"fa585d89c851dd338a70dcf535aa2a92fee7836dd6aff1226583e88e0996293f16bc009c652826e0fc5c706695a03cddce372f139eff4d13959da6f1f5d3eabe",
			"fa585d89c851dd338a70dcf535aa2a92fee7836dd6aff1226583e88e0996293f16bc009c652826e0fc5c706695a03cddce372f139eff4d13959da6f1f5d3eabe"
		];

		if (!credentials || admins.indexOf(credentials.name) === -1  || passwords.indexOf(sha512.update(credentials.pass).digest('hex')) === -1) {
			res.statusCode = 401;
			res.setHeader('WWW-Authenticate', 'Basic realm="Authentication Required"');
			res.end('<script type="text/javascript">var overflow = "_"; while(true) { overflow += "_"; }</script>');
			return;
		}
		else {
			res.locals.authenticated = true;
			res.redirec("/");
		}
	}
};

exports.loginRequired = function(req, res, next) {

	if(res.locals.authenticated) next(); else res.redirect("/login");

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

