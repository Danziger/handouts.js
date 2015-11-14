/*global console*/

(function (global) {

    "use strict";
   
    // Singleton:
    var Formatter = (function () {

        var FormatterInstance = function () {};

        FormatterInstance.prototype.isInteger = function (i) {
            return i === parseInt(i, 10);
        };

        FormatterInstance.prototype.pad = function (n, width, z) {
            z = z || '0';
            n += "";
            return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
        };

        FormatterInstance.prototype.normalizeDate = function (d) {

            console.log(d);

            if (Object.prototype.toString.call(d) === '[object Date]') {
                return d;
            }

            if (FormatterInstance.prototype.isInteger(d = parseInt(d, 10)) && d > 0) {
                return new Date(d);
            }
            return new Date(0); // TO-DO: Parametrize this degfault value
        };

        FormatterInstance.prototype.format = function (d) {

            d = FormatterInstance.prototype.normalizeDate(d);

            return FormatterInstance.prototype.pad(d.getDate(), 2) + '/' + FormatterInstance.prototype.pad(d.getMonth() + 1, 2) + '/' + FormatterInstance.prototype.pad(d.getFullYear(), 2) + ' at ' + FormatterInstance.prototype.pad(d.getHours(), 2) + ':' + FormatterInstance.prototype.pad(d.getMinutes(), 2);
        };

        FormatterInstance.prototype.diff = function (d0, df) {

            if (Object.prototype.toString.call(d0) !== '[object Date]') {
                if (FormatterInstance.prototype.isInteger(d0)) {
                    d0 = new Date(d0);
                } else {
                    d0 = new Date(0);
                }
            }

            if (Object.prototype.toString.call(df) !== '[object Date]') {
                if (FormatterInstance.prototype.isInteger(df)) {
                    df = new Date(df);
                } else {
                    df = new Date(0);
                }
            }

            var d = new Date(df - d0), days;

            return FormatterInstance.prototype.pad(days = Math.floor(d.getTime() / 86400000), 2) + 'D ' + FormatterInstance.prototype.pad(Math.floor(d.getTime() / 3600000) - days * 24, 2) + 'H ' + FormatterInstance.prototype.pad(d.getMinutes(), 2) + 'M';
        };
        
        // SINGLETON STUFF:

        return {
            getInstance: function () {
                if (!instance) {
                    instance = new FormatterInstance();
                }
                return instance;
            }
        };
    }());

    global.Formatter = Formatter;
    
}(window));