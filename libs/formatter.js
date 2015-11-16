/*global exports, module */

/* Same as public/js/formatter.js */

(function () {

    "use strict";
   
	var Formatter = function () {

        // https://code.google.com/p/jslibs/wiki/JavascriptTips#Singleton_pattern
        
		if (Formatter.prototype.SINGLETON_INSTANCE) {
			return Formatter.prototype.SINGLETON_INSTANCE;
		}
		
		Formatter.prototype.SINGLETON_INSTANCE = this;
	};
    
	Formatter.prototype.isInteger = function (i) {
		return i === parseInt(i, 10);
	};

	Formatter.prototype.pad = function (n, width, z) {
		z = z || "0";
		n += "";
		return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
	};

	Formatter.prototype.normalizeDate = function (d, defaultDate) {

		if (Object.prototype.toString.call(d) === "[object Date]") {
			return d;
		}

		if (Formatter.prototype.isInteger(d = parseInt(d, 10)) && d > 0) {
			return new Date(d);
		}
        
		return defaultDate ? Formatter.prototype.normalizeDate(defaultDate) : new Date(0);
	};

    Formatter.prototype.normalizeTimestamp = function (t, defaultTimestamp) {

		if (Object.prototype.toString.call(t) === "[object Date]") {
			return t.getTime();
		}

		if (Formatter.prototype.isInteger(t = parseInt(t, 10)) && t > 0) {
			return new Date(t).getTime();
		}
        
		return defaultTimestamp ? Formatter.prototype.normalizeTimestamp(defaultTimestamp) : 0;
    };
    
	Formatter.prototype.format = function (d) {

		d = Formatter.prototype.normalizeDate(d);

		return Formatter.prototype.pad(d.getDate(), 2) + "/" + Formatter.prototype.pad(d.getMonth() + 1, 2) + "/" + Formatter.prototype.pad(d.getFullYear(), 2) + " at " + Formatter.prototype.pad(d.getHours(), 2) + ":" + Formatter.prototype.pad(d.getMinutes(), 2);
	};

	Formatter.prototype.diff = function (d0, df) {

        var diff = Formatter.prototype.normalizeTimestamp(df) - Formatter.prototype.normalizeTimestamp(d0),
            suffix,
            days,
            d;

        if (diff < 0) {
            suffix = " AGO";
            d = new Date(-diff);
        } else {
            suffix = " LEFT";
            d = new Date(diff);
        }
        
		return Formatter.prototype.pad(days = Math.floor(d.getTime() / 86400000), 2) + "D " + Formatter.prototype.pad(Math.floor(d.getTime() / 3600000) - days * 24, 2) + "H " + Formatter.prototype.pad(d.getMinutes(), 2) + "M" + suffix;
	};

	// EXPORT:

    module.exports = Formatter;

}());