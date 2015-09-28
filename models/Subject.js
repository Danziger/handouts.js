module.exports = function(mongoose) {
	return mongoose.model('Subject',
		new mongoose.Schema({
			abbr: String,
			name: String
		}, {
			collection: 'subjects'
		})
	);
}