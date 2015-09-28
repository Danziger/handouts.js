
function isInteger(i) {
	return i === parseInt(i, 10);
};

function normalizeDate(d) {
	if(Object.prototype.toString.call(d) === '[object Date]') return d;
	if(isInteger(d = parseInt(d)) && d > 0) return new Date(d);
	return new Date(0); // TO-DO: Parametrize this degfault value
};

function normalizeTimestamp(d) {
	if(Object.prototype.toString.call(d) === '[object Date]') return d.getTime();
	if(isInteger(d = parseInt(d)) && d > 0) return new Date(d).getTime();
	return 0; // TO-DO: Parametrize this degfault value
};

function pad(n, width, z) {
	z = z || '0';
	n = n + '';
	return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
};

exports.format = function(d) {

	d = normalizeDate(d);

	return pad(d.getDate(), 2) + '/'
		+ pad(d.getMonth()+1, 2) + '/'
		+ pad(d.getFullYear(), 2) + ' at '
		+ pad(d.getHours(), 2) + ':'
		+ pad(d.getMinutes(), 2);  
};

exports.diff = function(d0, df) { // TO-DO: No need, will be updated in the browser!

	console.log(d0);
	console.log(df);
	console.log(normalizeTimestamp(df) - normalizeTimestamp(d0));

	var d = new Date(normalizeTimestamp(df) - normalizeTimestamp(d0));
	
	console.log(pad(days = Math.floor(d.getTime()/86400000), 2) + 'D ');
console.log(pad(days = Math.floor(d.getTime()/86400000), 2) + 'D ' + pad(Math.floor(d.getTime()/3600000) - days*24, 2) + 'H ' + pad(d.getMinutes(), 2) + 'M');


	return pad(days = Math.floor(d.getTime()/86400000), 2) + 'D '
		+ pad(Math.floor(d.getTime()/3600000) - days*24, 2) + 'H '
		+ pad(d.getMinutes(), 2) + 'M';  
};