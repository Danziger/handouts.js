/*global console*/

// https://code.google.com/p/jslibs/wiki/JavascriptTips#Singleton_pattern

(function (global) {

    "use strict";
   
	function Formatter() {

		if (Formatter.prototype._singletonInstance) {
			return Formatter.prototype._singletonInstance;
		}
		
		Formatter.prototype._singletonInstance = this;
	}

	Formatter.prototype.isInteger = function (i) {
		return i === parseInt(i, 10);
	};

	Formatter.prototype.pad = function (n, width, z) {
		z = z || '0';
		n += "";
		return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
	};

	Formatter.prototype.normalizeDate = function (d) {

		console.log(d);

		if (Object.prototype.toString.call(d) === '[object Date]') {
			return d;
		}

		if (Formatter.prototype.isInteger(d = parseInt(d, 10)) && d > 0) {
			return new Date(d);
		}
		return new Date(0); // TO-DO: Parametrize this degfault value
	};

	Formatter.prototype.format = function (d) {

		d = Formatter.prototype.normalizeDate(d);

		return Formatter.prototype.pad(d.getDate(), 2) + '/' + Formatter.prototype.pad(d.getMonth() + 1, 2) + '/' + Formatter.prototype.pad(d.getFullYear(), 2) + ' at ' + Formatter.prototype.pad(d.getHours(), 2) + ':' + Formatter.prototype.pad(d.getMinutes(), 2);
	};

	Formatter.prototype.diff = function (d0, df) {

		if (Object.prototype.toString.call(d0) !== '[object Date]') {
			if (Formatter.prototype.isInteger(d0)) {
				d0 = new Date(d0);
			} else {
				d0 = new Date(0);
			}
		}

		if (Object.prototype.toString.call(df) !== '[object Date]') {
			if (Formatter.prototype.isInteger(df)) {
				df = new Date(df);
			} else {
				df = new Date(0);
			}
		}

		var d = new Date(df - d0), days;

		return Formatter.prototype.pad(days = Math.floor(d.getTime() / 86400000), 2) + 'D ' + Formatter.prototype.pad(Math.floor(d.getTime() / 3600000) - days * 24, 2) + 'H ' + Formatter.prototype.pad(d.getMinutes(), 2) + 'M';
	};

	// SINGLETON STUFF:


    global.Formatter = new Formatter();
    global.FormatterClass = Formatter;
    
}(window));